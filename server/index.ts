import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { buildExplanationPrompt } from './prompt.js';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const CLAUDE_TIMEOUT_MS = 30_000;

// --- Spotify config ---
const SPOTIFY_CLIENT_ID = '67ac2a8d41a04a1b9105bdd37ba477e9';
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET ?? '';
const SPOTIFY_REDIRECT_URI = 'https://spotify-portal.duckdns.org/callback';
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const TOKEN_FILE = path.join(__dirname, '.spotify-token');

// --- Spotify data cache ---
const CACHE_TTL_MS = 86_400_000; // 24 hours
const cache: { data: Record<string, unknown> | null; timestamp: number } = { data: null, timestamp: 0 };

function isCacheValid(): boolean {
  return cache.data !== null && Date.now() - cache.timestamp < CACHE_TTL_MS;
}

const SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
  'user-read-recently-played',
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ');

// --- Token storage helpers ---
interface StoredTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

function loadTokens(): StoredTokens | null {
  try {
    if (fs.existsSync(TOKEN_FILE)) {
      return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
    }
  } catch {
    console.error('Failed to load token file');
  }
  return null;
}

function saveTokens(tokens: StoredTokens): void {
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
}

async function getFreshAccessToken(): Promise<string | null> {
  const tokens = loadTokens();
  if (!tokens) return null;

  // If token is still valid (with 5min buffer), return it
  if (Date.now() < tokens.expiresAt - 5 * 60 * 1000) {
    return tokens.accessToken;
  }

  // Refresh the token
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: tokens.refreshToken,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET,
  });

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!response.ok) {
    console.error('Token refresh failed:', response.status);
    return null;
  }

  const data = await response.json();
  const updated: StoredTokens = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token ?? tokens.refreshToken,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  saveTokens(updated);
  return updated.accessToken;
}

app.use(express.json());

// --- One-time OAuth routes ---
app.get('/auth/login', (_req, res) => {
  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope: SCOPES,
  });
  res.redirect(`${SPOTIFY_AUTH_URL}?${params.toString()}`);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) {
    res.status(400).send('Missing code parameter');
    return;
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: SPOTIFY_REDIRECT_URI,
    client_id: SPOTIFY_CLIENT_ID,
    client_secret: SPOTIFY_CLIENT_SECRET,
  });

  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Token exchange failed:', err);
      res.status(500).send('Token exchange failed');
      return;
    }

    const data = await response.json();
    const tokens: StoredTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    saveTokens(tokens);

    res.send('Spotify connected successfully! You can close this tab.');
  } catch (err) {
    console.error('Callback error:', err);
    res.status(500).send('Authentication failed');
  }
});

// --- Spotify proxy routes (with caching) ---

function shouldBypassCache(req: express.Request): boolean {
  return req.query.refresh === 'true';
}

function getCachedEntry(key: string): unknown | undefined {
  if (!isCacheValid() || !cache.data) return undefined;
  return cache.data[key];
}

function setCachedEntry(key: string, value: unknown): void {
  if (!cache.data || !isCacheValid()) {
    cache.data = {};
    cache.timestamp = Date.now();
  }
  cache.data[key] = value;
}

app.get('/api/spotify/me', async (req, res) => {
  const token = await getFreshAccessToken();
  if (!token) { res.status(401).json({ error: 'Not connected' }); return; }

  const cacheKey = 'me';
  if (!shouldBypassCache(req)) {
    const cached = getCachedEntry(cacheKey);
    if (cached) { console.log('[cache] HIT:', cacheKey); res.json(cached); return; }
  }
  console.log('[cache] MISS:', cacheKey);

  const response = await fetch(`${SPOTIFY_API_BASE}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) { res.status(response.status).json({ error: 'Spotify API error' }); return; }
  const data = await response.json();
  setCachedEntry(cacheKey, data);
  res.json(data);
});

app.get('/api/spotify/top-tracks', async (req, res) => {
  const token = await getFreshAccessToken();
  if (!token) { res.status(401).json({ error: 'Not connected' }); return; }

  const timeRange = req.query.time_range ?? 'medium_term';
  const cacheKey = `top-tracks-${timeRange}`;
  if (!shouldBypassCache(req)) {
    const cached = getCachedEntry(cacheKey);
    if (cached) { console.log('[cache] HIT:', cacheKey); res.json(cached); return; }
  }
  console.log('[cache] MISS:', cacheKey);

  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/top/tracks?time_range=${timeRange}&limit=20`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) { res.status(response.status).json({ error: 'Spotify API error' }); return; }
  const data = await response.json();
  setCachedEntry(cacheKey, data);
  res.json(data);
});

app.get('/api/spotify/top-artists', async (req, res) => {
  const token = await getFreshAccessToken();
  if (!token) { res.status(401).json({ error: 'Not connected' }); return; }

  const timeRange = req.query.time_range ?? 'medium_term';
  const cacheKey = `top-artists-${timeRange}`;
  if (!shouldBypassCache(req)) {
    const cached = getCachedEntry(cacheKey);
    if (cached) { console.log('[cache] HIT:', cacheKey); res.json(cached); return; }
  }
  console.log('[cache] MISS:', cacheKey);

  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/top/artists?time_range=${timeRange}&limit=20`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) { res.status(response.status).json({ error: 'Spotify API error' }); return; }
  const data = await response.json();
  setCachedEntry(cacheKey, data);
  res.json(data);
});

app.get('/api/spotify/recently-played', async (req, res) => {
  const token = await getFreshAccessToken();
  if (!token) { res.status(401).json({ error: 'Not connected' }); return; }

  const cacheKey = 'recently-played';
  if (!shouldBypassCache(req)) {
    const cached = getCachedEntry(cacheKey);
    if (cached) { console.log('[cache] HIT:', cacheKey); res.json(cached); return; }
  }
  console.log('[cache] MISS:', cacheKey);

  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/player/recently-played?limit=20`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) { res.status(response.status).json({ error: 'Spotify API error' }); return; }
  const data = await response.json();
  setCachedEntry(cacheKey, data);
  res.json(data);
});

app.get('/api/spotify/for-you', async (req, res) => {
  const token = await getFreshAccessToken();
  if (!token) { res.status(401).json({ error: 'Not connected' }); return; }

  const cacheKey = 'for-you';
  if (!shouldBypassCache(req)) {
    const cached = getCachedEntry(cacheKey);
    if (cached) { console.log('[cache] HIT:', cacheKey); res.json(cached); return; }
  }
  console.log('[cache] MISS:', cacheKey);

  // Fetch short-term top tracks and recently played in parallel
  const [topRes, recentRes] = await Promise.all([
    fetch(`${SPOTIFY_API_BASE}/me/top/tracks?time_range=short_term&limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${SPOTIFY_API_BASE}/me/player/recently-played?limit=20`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const tracks: unknown[] = [];
  const seenIds = new Set<string>();

  if (topRes.ok) {
    const topData = await topRes.json();
    for (const track of topData.items ?? []) {
      if (!seenIds.has(track.id)) {
        seenIds.add(track.id);
        tracks.push(track);
      }
    }
  }

  if (recentRes.ok) {
    const recentData = await recentRes.json();
    for (const item of recentData.items ?? []) {
      if (item.track && !seenIds.has(item.track.id)) {
        seenIds.add(item.track.id);
        tracks.push(item.track);
      }
    }
  }

  // Return in the same shape as the old recommendations endpoint
  const data = { tracks: tracks.slice(0, 20) };
  setCachedEntry(cacheKey, data);
  res.json(data);
});

app.get('/api/spotify/playlists', async (req, res) => {
  const token = await getFreshAccessToken();
  if (!token) { res.status(401).json({ error: 'Not connected' }); return; }

  const cacheKey = 'playlists';
  if (!shouldBypassCache(req)) {
    const cached = getCachedEntry(cacheKey);
    if (cached) { console.log('[cache] HIT:', cacheKey); res.json(cached); return; }
  }
  console.log('[cache] MISS:', cacheKey);

  const response = await fetch(
    `${SPOTIFY_API_BASE}/me/playlists?limit=20`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) { res.status(response.status).json({ error: 'Spotify API error' }); return; }
  const data = await response.json();
  setCachedEntry(cacheKey, data);
  res.json(data);
});

// Audio features endpoint is restricted (403) for new Spotify apps since Nov 2024.
// Return an empty response so the frontend does not error.
app.get('/api/spotify/audio-features/:ids', (_req, res) => {
  res.json({ audio_features: [] });
});

app.get('/api/spotify/token', async (_req, res) => {
  const token = await getFreshAccessToken();
  if (!token) { res.status(401).json({ error: 'Not connected' }); return; }
  res.json({ accessToken: token });
});

// --- Claude explanation endpoint ---
app.post('/api/explain', async (req, res) => {
  try {
    const { trackName, artistName, userTopGenres, userTopArtists, popularity, matchReasons } = req.body;

    if (!trackName || !artistName) {
      res.status(400).json({ error: 'trackName and artistName are required' });
      return;
    }

    const prompt = buildExplanationPrompt({
      trackName,
      artistName,
      userTopGenres,
      userTopArtists,
      popularity,
      matchReasons,
    });

    const claudePath = process.env.CLAUDE_PATH || '/usr/bin/claude';
    const { stdout, stderr } = await execFileAsync(claudePath, ['-p', prompt], {
      timeout: CLAUDE_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,
      env: { ...process.env, HOME: process.env.HOME || '/root' },
    });

    if (stderr) {
      console.warn('Claude CLI stderr:', stderr);
    }

    const rawText = stdout.trim();
    if (!rawText) {
      res.status(502).json({ error: 'Claude returned empty response' });
      return;
    }

    // Try to parse three-tier JSON response
    let basic: string;
    let detailed: string;
    let technical: string;
    try {
      const parsed = JSON.parse(rawText);
      basic = parsed.basic ?? rawText;
      detailed = parsed.detailed ?? rawText;
      technical = parsed.technical ?? rawText;
    } catch {
      // Fallback: use raw text for all tiers
      basic = rawText;
      detailed = rawText;
      technical = rawText;
    }

    res.json({ explanation: { basic, detailed, technical } });
  } catch (err: unknown) {
    const error = err as Error & { killed?: boolean; code?: string | number; signal?: string };

    if (error.killed || error.signal === 'SIGTERM') {
      console.error('Claude CLI timed out after', CLAUDE_TIMEOUT_MS, 'ms');
      res.status(504).json({ error: 'Explanation generation timed out' });
      return;
    }

    if (error.code === 'ENOENT') {
      console.error('Claude CLI not found on PATH — is it installed?');
      res.status(503).json({ error: 'Claude CLI not available' });
      return;
    }

    console.error('Claude explanation error:', error.message);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// Serve Vite production build
app.use(express.static(path.join(__dirname, '..', 'dist')));

// SPA fallback — must come after API routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
