import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { buildExplanationPrompt } from './prompt.js';

function runClaude(claudePath: string, args: string[], options: { timeout: number; env: NodeJS.ProcessEnv }): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(claudePath, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: options.env,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
    child.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    const timer = setTimeout(() => { child.kill('SIGTERM'); reject(Object.assign(new Error('timeout'), { killed: true })); }, options.timeout);
    child.on('close', (code) => { clearTimeout(timer); if (code !== 0 && !stdout) { reject(new Error(`exit code ${code}`)); } else { resolve({ stdout, stderr }); } });
    child.on('error', (err) => { clearTimeout(timer); reject(err); });
  });
}
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
  'playlist-read-private',
  'playlist-read-collaborative',
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

// --- Mock playlist track data ---
interface MockTrackDef {
  name: string;
  artist: string;
  album: string;
}

const rockTracks: MockTrackDef[] = [
  { name: 'Everlong', artist: 'Foo Fighters', album: 'The Colour and the Shape' },
  { name: 'Black Dog', artist: 'Led Zeppelin', album: 'Led Zeppelin IV' },
  { name: 'Back in Black', artist: 'AC/DC', album: 'Back in Black' },
  { name: 'Alive', artist: 'Pearl Jam', album: 'Ten' },
  { name: 'Under the Bridge', artist: 'Red Hot Chili Peppers', album: 'Blood Sugar Sex Magik' },
  { name: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind' },
  { name: 'Paranoid', artist: 'Black Sabbath', album: 'Paranoid' },
  { name: 'Welcome to the Jungle', artist: 'Guns N\' Roses', album: 'Appetite for Destruction' },
  { name: 'Enter Sandman', artist: 'Metallica', album: 'Metallica' },
  { name: 'Comfortably Numb', artist: 'Pink Floyd', album: 'The Wall' },
  { name: 'Thunderstruck', artist: 'AC/DC', album: 'The Razors Edge' },
  { name: 'Won\'t Get Fooled Again', artist: 'The Who', album: 'Who\'s Next' },
];

const chillTracks: MockTrackDef[] = [
  { name: 'Holocene', artist: 'Bon Iver', album: 'Bon Iver, Bon Iver' },
  { name: 'Skinny Love', artist: 'Bon Iver', album: 'For Emma, Forever Ago' },
  { name: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming' },
  { name: 'Re: Stacks', artist: 'Bon Iver', album: 'For Emma, Forever Ago' },
  { name: 'Myth', artist: 'Beach House', album: 'Bloom' },
  { name: 'Breathe Me', artist: 'Sia', album: 'Colour the Small One' },
  { name: 'Lost in the Light', artist: 'Bahamas', album: 'Barchords' },
  { name: 'To Build a Home', artist: 'The Cinematic Orchestra', album: 'Ma Fleur' },
  { name: 'Such Great Heights', artist: 'The Postal Service', album: 'Give Up' },
  { name: 'On Melancholy Hill', artist: 'Gorillaz', album: 'Plastic Beach' },
  { name: 'Dues', artist: 'Big Thief', album: 'Masterpiece' },
  { name: 'Strange Trails', artist: 'Lord Huron', album: 'Strange Trails' },
];

const popDanceTracks: MockTrackDef[] = [
  { name: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia' },
  { name: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours' },
  { name: 'Physical', artist: 'Dua Lipa', album: 'Future Nostalgia' },
  { name: 'Don\'t Start Now', artist: 'Dua Lipa', album: 'Future Nostalgia' },
  { name: 'Save Your Tears', artist: 'The Weeknd', album: 'After Hours' },
  { name: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line' },
  { name: 'Kiss Me More', artist: 'Doja Cat', album: 'Planet Her' },
  { name: 'Heat Waves', artist: 'Glass Animals', album: 'Dreamland' },
  { name: 'drivers license', artist: 'Olivia Rodrigo', album: 'SOUR' },
  { name: 'good 4 u', artist: 'Olivia Rodrigo', album: 'SOUR' },
  { name: 'Peaches', artist: 'Justin Bieber', album: 'Justice' },
  { name: 'Montero', artist: 'Lil Nas X', album: 'Montero' },
];

const emoTracks: MockTrackDef[] = [
  { name: 'Sugar, We\'re Goin Down', artist: 'Fall Out Boy', album: 'From Under the Cork Tree' },
  { name: 'I\'m Not Okay', artist: 'My Chemical Romance', album: 'Three Cheers for Sweet Revenge' },
  { name: 'MakeDamnSure', artist: 'Taking Back Sunday', album: 'Louder Now' },
  { name: 'Misery Business', artist: 'Paramore', album: 'Riot!' },
  { name: 'The Middle', artist: 'Jimmy Eat World', album: 'Bleed American' },
  { name: 'Ohio Is for Lovers', artist: 'Hawthorne Heights', album: 'The Silence in Black and White' },
  { name: 'Cute Without the E', artist: 'Taking Back Sunday', album: 'Tell All Your Friends' },
  { name: 'Screaming Infidelities', artist: 'Dashboard Confessional', album: 'The Places You Have Come to Fear the Most' },
  { name: 'Welcome to the Black Parade', artist: 'My Chemical Romance', album: 'The Black Parade' },
  { name: 'Swing, Swing', artist: 'The All-American Rejects', album: 'The All-American Rejects' },
  { name: 'Flavor of the Weak', artist: 'American Hi-Fi', album: 'American Hi-Fi' },
  { name: 'The Kill', artist: 'Thirty Seconds to Mars', album: 'A Beautiful Lie' },
];

const eclecticTracks: MockTrackDef[] = [
  { name: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular' },
  { name: 'Do I Wanna Know?', artist: 'Arctic Monkeys', album: 'AM' },
  { name: 'Take Me Out', artist: 'Franz Ferdinand', album: 'Franz Ferdinand' },
  { name: 'Somebody Told Me', artist: 'The Killers', album: 'Hot Fuss' },
  { name: 'Stressed Out', artist: 'Twenty One Pilots', album: 'Blurryface' },
  { name: 'Pumped Up Kicks', artist: 'Foster the People', album: 'Torches' },
  { name: 'Lonely Boy', artist: 'The Black Keys', album: 'El Camino' },
  { name: 'Tongue Tied', artist: 'Grouplove', album: 'Never Trust a Happy Song' },
  { name: 'Shut Up and Dance', artist: 'Walk the Moon', album: 'Talking Is Hard' },
  { name: 'Riptide', artist: 'Vance Joy', album: 'Dream Your Life Away' },
  { name: 'Ophelia', artist: 'The Lumineers', album: 'Cleopatra' },
  { name: 'Taro', artist: 'alt-J', album: 'An Awesome Wave' },
];

function classifyPlaylistName(name: string): { tracks: MockTrackDef[]; genre: string; mood: string } {
  const lower = name.toLowerCase();
  if (/rock|guitar|metal|headbang|riff/.test(lower)) {
    return { tracks: rockTracks, genre: 'rock', mood: 'energetic' };
  }
  if (/emo|punk|screamo|angst|sad boi/.test(lower)) {
    return { tracks: emoTracks, genre: 'emo/punk', mood: 'angsty' };
  }
  if (/emotional|chill|calm|relax|sleep|vibe|mellow|acoustic|indie|lo-fi|lofi/.test(lower)) {
    return { tracks: chillTracks, genre: 'indie/chill', mood: 'relaxed' };
  }
  if (/summer|dance|party|upbeat|hype|pop|workout|run|energy|club/.test(lower)) {
    return { tracks: popDanceTracks, genre: 'pop/dance', mood: 'upbeat' };
  }
  return { tracks: eclecticTracks, genre: 'eclectic', mood: 'varied' };
}

function generateMockPlaylistTracks(playlistName: string): { items: { track: Record<string, unknown>; added_at: string }[] } {
  const { tracks } = classifyPlaylistName(playlistName);
  // Use a seeded shuffle based on playlist name for consistency
  let hash = 0;
  for (let i = 0; i < playlistName.length; i++) {
    hash = ((hash << 5) - hash + playlistName.charCodeAt(i)) | 0;
  }
  const shuffled = [...tracks].sort((a, b) => {
    const ha = ((hash * 31 + a.name.length) | 0) & 0x7fffffff;
    const hb = ((hash * 31 + b.name.length) | 0) & 0x7fffffff;
    return ha - hb;
  });
  const count = 10 + (Math.abs(hash) % 3); // 10-12 tracks
  const selected = shuffled.slice(0, count);

  const items = selected.map((def, index) => {
    const duration = 180000 + ((Math.abs(hash * (index + 1)) % 120001));
    const popularity = 40 + ((Math.abs(hash * (index + 7)) % 46));
    return {
      added_at: new Date(Date.now() - (index * 86400000)).toISOString(),
      track: {
        id: `mock-playlist-track-${index}`,
        name: def.name,
        artists: [{ id: `mock-artist-${def.artist.replace(/\s/g, '-').toLowerCase()}`, name: def.artist }],
        album: {
          id: `mock-album-${index}`,
          name: def.album,
          images: [{ url: `https://via.placeholder.com/300/181818/1DB954?text=${encodeURIComponent('\u266B')}`, width: 300, height: 300 }],
        },
        duration_ms: duration,
        popularity,
        uri: `spotify:track:mock-playlist-track-${index}`,
      },
    };
  });

  return { items };
}

app.get('/api/spotify/playlists/:id/tracks', (req, res) => {
  const playlistId = req.params.id;
  const playlistName = (req.query.name as string) || 'My Playlist';
  const cacheKey = `playlist-tracks-${playlistId}`;
  if (!shouldBypassCache(req)) {
    const cached = getCachedEntry(cacheKey);
    if (cached) { console.log('[cache] HIT:', cacheKey); res.json(cached); return; }
  }
  console.log('[cache] MISS:', cacheKey, '- generating mock tracks for:', playlistName);

  const data = generateMockPlaylistTracks(playlistName);
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

// --- Claude explanation cache (persists until server restart or manual refresh) ---
const explanationCache: Record<string, { basic: string; detailed: string; technical: string; factors?: { name: string; weight: number }[] }> = {};

app.post('/api/explain', async (req, res) => {
  try {
    const { trackName, artistName, userTopGenres, userTopArtists, popularity, matchReasons, position, source, artistRank } = req.body;

    if (!trackName || !artistName) {
      res.status(400).json({ error: 'trackName and artistName are required' });
      return;
    }

    // Check explanation cache first
    const cacheKey = `${trackName}::${artistName}`;
    if (explanationCache[cacheKey] && req.query.refresh !== 'true') {
      console.log('[explain-cache] HIT:', cacheKey);
      res.json({ explanation: explanationCache[cacheKey] });
      return;
    }
    console.log('[explain-cache] MISS:', cacheKey);

    const prompt = buildExplanationPrompt({
      trackName,
      artistName,
      userTopGenres,
      userTopArtists,
      popularity,
      matchReasons,
      position,
      source,
      artistRank,
    });

    const claudePath = process.env.CLAUDE_PATH || '/usr/bin/claude';
    const { stdout, stderr } = await runClaude(claudePath, ['-p', prompt], {
      timeout: CLAUDE_TIMEOUT_MS,
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
    let factors: { name: string; weight: number }[] | undefined;
    try {
      const parsed = JSON.parse(rawText);
      basic = parsed.basic ?? rawText;
      detailed = parsed.detailed ?? rawText;
      technical = parsed.technical ?? rawText;
      if (Array.isArray(parsed.factors) && parsed.factors.length > 0) {
        factors = parsed.factors
          .filter((f: unknown) => f && typeof f === 'object' && 'name' in (f as Record<string, unknown>) && 'weight' in (f as Record<string, unknown>))
          .map((f: { name: string; weight: number }) => ({
            name: String(f.name),
            weight: Number(f.weight) || 0.1,
          }));
        if (factors!.length === 0) factors = undefined;
      }
    } catch {
      // Fallback: use raw text for all tiers
      basic = rawText;
      detailed = rawText;
      technical = rawText;
    }

    const result = { basic, detailed, technical, factors };
    explanationCache[cacheKey] = result;
    res.json({ explanation: result });
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
