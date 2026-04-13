# Architecture Addendum v2: Spotify API + Claude Integration

> Addendum to `architecture.md`. The existing v1 architecture remains the canonical reference for shell layout, demo page design, presentation/video/appendix tabs, styling strategy, and mock data schema. This document covers only the new integration layer.

---

## 1. Express Backend

### 1.1 Purpose

A minimal Express server that:
1. Serves the Vite production build (`dist/`) as static files, replacing nginx (D-011)
2. Provides a single API endpoint `POST /api/explain` that generates Claude-powered recommendation explanations

### 1.2 CLI Approach — No Anthropic SDK

The backend does **NOT** use the `@anthropic-ai/sdk` package or any API key. Instead it shells out to the **Claude Code CLI** (`claude`) which is installed and authenticated on the droplet via the user's Claude Code subscription. The `-p` flag (short for `--print`) runs a single non-interactive prompt and writes the response to stdout.

This means:
- **Zero API key management** — the CLI handles its own auth
- **No `@anthropic-ai/sdk` dependency** in `server/package.json`
- The only requirement is that `claude` is on the system PATH and authenticated

### 1.3 Server File

**File:** `server/index.ts`

```typescript
import express from 'express';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { buildExplanationPrompt } from './prompt.js';

const execFileAsync = promisify(execFile);
const app = express();
const PORT = 80;
const CLAUDE_TIMEOUT_MS = 30_000;

// Parse JSON request bodies
app.use(express.json());

// API endpoint — must be registered before static file serving
app.post('/api/explain', async (req, res) => {
  try {
    const { trackName, artistName, audioFeatures, userTopGenres, matchReasons } = req.body;

    if (!trackName || !artistName) {
      return res.status(400).json({ error: 'trackName and artistName are required' });
    }

    const prompt = buildExplanationPrompt({
      trackName,
      artistName,
      audioFeatures,
      userTopGenres,
      matchReasons,
    });

    // Shell out to Claude Code CLI — `-p` is the non-interactive print flag
    const { stdout, stderr } = await execFileAsync('claude', ['-p', prompt], {
      timeout: CLAUDE_TIMEOUT_MS,
      maxBuffer: 1024 * 1024,  // 1MB — more than enough for a short explanation
    });

    if (stderr) {
      console.warn('Claude CLI stderr:', stderr);
    }

    const explanation = stdout.trim();
    if (!explanation) {
      return res.status(502).json({ error: 'Claude returned empty response' });
    }

    res.json({ explanation });
  } catch (err: unknown) {
    const error = err as Error & { killed?: boolean; code?: string | number; signal?: string };

    // Distinguish timeout from other failures
    if (error.killed || error.signal === 'SIGTERM') {
      console.error('Claude CLI timed out after', CLAUDE_TIMEOUT_MS, 'ms');
      return res.status(504).json({ error: 'Explanation generation timed out' });
    }

    if (error.code === 'ENOENT') {
      console.error('Claude CLI not found on PATH — is it installed?');
      return res.status(503).json({ error: 'Claude CLI not available' });
    }

    console.error('Claude explanation error:', error.message);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// Serve Vite production build
app.use(express.static(path.join(__dirname, '..', 'dist')));

// SPA fallback — all unmatched routes serve index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 1.4 Claude Prompt Template

**File:** `server/prompt.ts`

```typescript
interface ExplanationInput {
  trackName: string;
  artistName: string;
  audioFeatures?: {
    danceability: number;    // 0.0 - 1.0
    energy: number;          // 0.0 - 1.0
    valence: number;         // 0.0 - 1.0 (musical positivity)
    tempo: number;           // BPM
    acousticness: number;    // 0.0 - 1.0
    instrumentalness: number; // 0.0 - 1.0
  };
  userTopGenres?: string[];
  matchReasons?: string[];
}

export function buildExplanationPrompt(input: ExplanationInput): string {
  const { trackName, artistName, audioFeatures, userTopGenres, matchReasons } = input;

  let audioSection = '';
  if (audioFeatures) {
    audioSection = `
Audio profile of this track:
- Danceability: ${(audioFeatures.danceability * 100).toFixed(0)}%
- Energy: ${(audioFeatures.energy * 100).toFixed(0)}%
- Positivity (valence): ${(audioFeatures.valence * 100).toFixed(0)}%
- Tempo: ${audioFeatures.tempo.toFixed(0)} BPM
- Acousticness: ${(audioFeatures.acousticness * 100).toFixed(0)}%
- Instrumentalness: ${(audioFeatures.instrumentalness * 100).toFixed(0)}%`;
  }

  let genreSection = '';
  if (userTopGenres && userTopGenres.length > 0) {
    genreSection = `\nYour most-listened genres: ${userTopGenres.slice(0, 5).join(', ')}`;
  }

  let reasonSection = '';
  if (matchReasons && matchReasons.length > 0) {
    reasonSection = `\nMatch signals: ${matchReasons.join('; ')}`;
  }

  return `You are Spotify's algorithmic transparency feature. Write a brief, friendly explanation (3-4 sentences) of why "${trackName}" by ${artistName} was recommended to this listener.

Reference specific audio characteristics and listening patterns in your explanation. Sound like a knowledgeable music friend, not a robot. Use second person ("you" / "your").
${audioSection}${genreSection}${reasonSection}

Rules:
- Do NOT use markdown, bullet points, or headers
- Do NOT start with "We recommended" or "This track was recommended"
- DO start with a concrete observation about the music or the listener's taste
- Keep it under 60 words
- Sound like it belongs in the Spotify app`;
}
```

### 1.5 Server Dependencies

**File:** `server/package.json` (separate from the frontend)

Note: There is deliberately **no** `@anthropic-ai/sdk` here. The Claude CLI handles everything.

```json
{
  "name": "spotify-decision-server",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node --loader ts-node/esm index.ts",
    "build": "tsc",
    "start:prod": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.21.0"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.0.0",
    "ts-node": "^10.9.0",
    "typescript": "^5.7.0"
  }
}
```

### 1.6 Environment Assumptions

- Runs on the existing Ubuntu DigitalOcean droplet at `104.248.113.208`
- **Claude Code CLI** (`claude`) is installed and authenticated on the server via the user's Claude Code subscription. The user runs `claude` once interactively to authenticate before starting the Express server.
- Express replaces nginx: the server listens on port 80 directly
- The `dist/` directory is produced by `npm run build` in the frontend project root
- The `claude` binary must be on the system PATH (e.g., installed via `npm install -g @anthropic-ai/claude-code` or the standalone installer)

---

## 2. Spotify OAuth PKCE Flow

### 2.1 Overview

Client-side only OAuth 2.0 with PKCE (Proof Key for Code Exchange). No backend involvement for authentication. This follows Spotify's recommended flow for SPAs (D-012).

### 2.2 Configuration

**File:** `src/config/spotify.ts`

```typescript
export const SPOTIFY_CONFIG = {
  clientId: 'YOUR_CLIENT_ID_HERE',  // User provides their own from Spotify Developer Dashboard
  redirectUri: 'http://104.248.113.208/callback',
  scopes: [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'streaming',
    'user-read-playback-state',
    'user-modify-playback-state',
  ],
  authEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
} as const;
```

### 2.3 Auth Service

**File:** `src/services/spotifyAuth.ts`

```typescript
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;  // Unix timestamp ms
}

export const spotifyAuth = {
  /** Generate PKCE code verifier (random 64-char string) */
  generateCodeVerifier(): string,

  /** SHA-256 hash the verifier, base64url encode it */
  async generateCodeChallenge(verifier: string): Promise<string>,

  /** Build the Spotify authorize URL and redirect the browser */
  initiateLogin(): Promise<void>,

  /** Parse the callback URL, exchange code for tokens, store in sessionStorage */
  handleCallback(): Promise<AuthTokens>,

  /** Get current tokens from sessionStorage, auto-refresh if within 5 min of expiry */
  async getAccessToken(): Promise<string | null>,

  /** Refresh the access token using the refresh token */
  async refreshAccessToken(): Promise<AuthTokens>,

  /** Remove tokens from sessionStorage */
  logout(): void,

  /** Check if user has valid tokens */
  isAuthenticated(): boolean,
};
```

### 2.4 PKCE Flow Steps

1. **Login initiated**: User clicks "Connect Spotify" button
2. **Generate PKCE pair**: Create random `code_verifier` (64 chars, `[A-Za-z0-9-._~]`), hash with SHA-256, base64url-encode as `code_challenge`
3. **Store verifier**: Save `code_verifier` in `sessionStorage` (needed for token exchange)
4. **Redirect**: Navigate to `https://accounts.spotify.com/authorize` with query params:
   - `client_id`, `response_type=code`, `redirect_uri`, `scope` (space-separated), `code_challenge_method=S256`, `code_challenge`
5. **User authorizes on Spotify**: Spotify redirects back to `http://104.248.113.208/callback?code=...`
6. **App handles callback**: On mount, check `window.location.search` for `code` param
7. **Exchange code for tokens**: POST to `https://accounts.spotify.com/api/token` with `grant_type=authorization_code`, `code`, `redirect_uri`, `client_id`, `code_verifier`
8. **Store tokens**: Save `access_token`, `refresh_token`, `expires_in` (converted to absolute timestamp) in `sessionStorage`
9. **Clean URL**: Replace URL state to remove `?code=...` from the address bar
10. **Auto-refresh**: Before any API call, check if token expires within 5 minutes. If so, POST to token endpoint with `grant_type=refresh_token`.

### 2.5 Callback Handling

The SPA already handles all routes via `index.html` (Express SPA fallback). When the browser hits `/callback?code=...`, the React app loads and the `SpotifyProvider` (Section 5) checks for the code parameter on mount.

---

## 3. Spotify API Service

### 3.1 Service Module

**File:** `src/services/spotifyApi.ts`

```typescript
const BASE_URL = 'https://api.spotify.com/v1';

/** Wrapper that attaches the access token and handles 401 retry */
async function spotifyFetch<T>(
  endpoint: string,
  token: string,
  options?: RequestInit,
): Promise<T>;

export const spotifyApi = {
  /** GET /me — Current user's profile */
  getMe(token: string): Promise<SpotifyUser>,

  /** GET /me/top/tracks?time_range=...&limit=20 */
  getTopTracks(token: string, timeRange?: 'short_term' | 'medium_term' | 'long_term'): Promise<SpotifyTopTracks>,

  /** GET /me/top/artists?time_range=...&limit=20 */
  getTopArtists(token: string, timeRange?: 'short_term' | 'medium_term' | 'long_term'): Promise<SpotifyTopArtists>,

  /** GET /me/player/recently-played?limit=20 */
  getRecentlyPlayed(token: string): Promise<SpotifyRecentlyPlayed>,

  /** GET /recommendations?seed_tracks=...&seed_artists=...&seed_genres=...&limit=10 */
  getRecommendations(
    token: string,
    params: { seedTracks?: string[]; seedArtists?: string[]; seedGenres?: string[] },
  ): Promise<SpotifyRecommendations>,

  /** GET /audio-features?ids=id1,id2,... */
  getAudioFeatures(token: string, trackIds: string[]): Promise<SpotifyAudioFeatures>,

  /** GET /tracks/{id} */
  getTrack(token: string, id: string): Promise<SpotifyTrack>,

  /** GET /artists/{id} */
  getArtist(token: string, id: string): Promise<SpotifyArtist>,
};
```

### 3.2 401 Handling

The `spotifyFetch` wrapper:
1. Makes the request with `Authorization: Bearer ${token}`
2. If the response is 401, calls `spotifyAuth.refreshAccessToken()`
3. Retries the request once with the new token
4. If the retry also fails, throws an error that the `SpotifyContext` catches to reset auth state

### 3.3 Spotify API Response Types

**File:** `src/services/spotifyTypes.ts`

Defines TypeScript interfaces that mirror the Spotify Web API JSON responses. Key types:

```typescript
export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string; width: number; height: number }[];
  product: 'free' | 'open' | 'premium';
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  duration_ms: number;
  popularity: number;
  uri: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images: { url: string; width: number; height: number }[];
  genres: string[];
  popularity: number;
}

export interface SpotifyAudioFeature {
  id: string;
  danceability: number;
  energy: number;
  valence: number;
  tempo: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
  liveness: number;
  loudness: number;
  key: number;
  mode: number;
  time_signature: number;
}

export interface SpotifyTopTracks {
  items: SpotifyTrack[];
  total: number;
}

export interface SpotifyTopArtists {
  items: SpotifyArtist[];
  total: number;
}

export interface SpotifyRecentlyPlayed {
  items: { track: SpotifyTrack; played_at: string }[];
}

export interface SpotifyRecommendations {
  tracks: SpotifyTrack[];
  seeds: { id: string; type: string }[];
}

export interface SpotifyAudioFeatures {
  audio_features: SpotifyAudioFeature[];
}
```

---

## 4. Web Playback SDK Integration

### 4.1 Overview

The Spotify Web Playback SDK allows Premium users to play music directly in the browser. The SDK is loaded via a script tag and controlled through a JavaScript API (D-013).

### 4.2 SDK Loading

**File:** `src/services/spotifyPlayer.ts`

The SDK script (`https://sdk.scdn.co/spotify-player.js`) is loaded dynamically when the user authenticates. Spotify's SDK exposes a global `window.Spotify.Player` constructor and calls `window.onSpotifyWebPlaybackSDKReady` when ready.

```typescript
export function loadSpotifySDK(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Spotify) {
      resolve();
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => resolve();
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    document.body.appendChild(script);
  });
}
```

### 4.3 useSpotifyPlayer Hook

**File:** `src/hooks/useSpotifyPlayer.ts`

```typescript
interface SpotifyPlayerState {
  /** The Spotify Player instance (null until SDK loads + auth) */
  player: Spotify.Player | null;
  /** Spotify-assigned device ID for this browser player */
  deviceId: string | null;
  /** Whether playback is active */
  isPlaying: boolean;
  /** Currently playing track info */
  currentTrack: {
    name: string;
    artists: string[];
    albumName: string;
    albumImageUrl: string;
    durationMs: number;
    uri: string;
  } | null;
  /** Playback position in ms */
  positionMs: number;
  /** Volume 0-1 */
  volume: number;
  /** Whether the SDK is ready and connected */
  isReady: boolean;
  /** Play a track by Spotify URI */
  play: (uri: string) => Promise<void>;
  /** Toggle play/pause */
  togglePlay: () => Promise<void>;
  /** Skip to next track */
  nextTrack: () => Promise<void>;
  /** Skip to previous track */
  previousTrack: () => Promise<void>;
  /** Seek to position in ms */
  seek: (positionMs: number) => Promise<void>;
  /** Set volume (0-1) */
  setVolume: (volume: number) => Promise<void>;
}

export function useSpotifyPlayer(accessToken: string | null): SpotifyPlayerState;
```

### 4.4 Hook Implementation Details

1. **Initialization**: When `accessToken` is non-null, load the SDK via `loadSpotifySDK()`, then create a `new Spotify.Player({ name: 'Decision Transparency Portal', getOAuthToken: cb => cb(accessToken) })`
2. **Event listeners**:
   - `ready`: Store the `device_id`, call Spotify's `PUT /me/player` to transfer playback to this device
   - `player_state_changed`: Update `isPlaying`, `currentTrack`, `positionMs` from the state object
   - `not_ready`: Reset `deviceId` to null
3. **Position tracking**: Use a `requestAnimationFrame` loop to interpolate `positionMs` between `player_state_changed` events for smooth progress bar updates
4. **Cleanup**: On unmount or token change, call `player.disconnect()`
5. **Play function**: Uses Spotify Web API `PUT /me/player/play` with `{ uris: [uri] }` and `device_id` query param

### 4.5 Global Type Declaration

**File:** `src/spotify-sdk.d.ts`

```typescript
declare namespace Spotify {
  interface Player {
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: string, callback: Function): void;
    removeListener(event: string, callback?: Function): void;
    getCurrentState(): Promise<PlaybackState | null>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(positionMs: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
  }

  interface PlaybackState {
    paused: boolean;
    position: number;
    duration: number;
    track_window: {
      current_track: WebPlaybackTrack;
      previous_tracks: WebPlaybackTrack[];
      next_tracks: WebPlaybackTrack[];
    };
  }

  interface WebPlaybackTrack {
    uri: string;
    id: string;
    name: string;
    duration_ms: number;
    artists: { name: string; uri: string }[];
    album: {
      name: string;
      uri: string;
      images: { url: string; width: number; height: number }[];
    };
  }
}

interface Window {
  Spotify: {
    Player: new (options: {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }) => Spotify.Player;
  };
  onSpotifyWebPlaybackSDKReady: () => void;
}
```

---

## 5. Data Layer — Dual Mode (SpotifyContext)

### 5.1 Overview

A React Context provides a unified data layer that works in two modes (D-014):
- **Mock mode** (default, unauthenticated): uses existing mock data from `src/data/`
- **Live mode** (authenticated): fetches real data from Spotify API, gets Claude explanations from `/api/explain`

Components consume data through the context and do not care which mode is active.

### 5.2 Context Shape

**File:** `src/context/SpotifyContext.tsx`

```typescript
interface SpotifyContextValue {
  /** Authentication state */
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;

  /** User profile (null when not authenticated) */
  user: {
    displayName: string;
    avatarUrl: string | null;
    isPremium: boolean;
  } | null;

  /** Playback — delegates to useSpotifyPlayer when authenticated, usePlaybackSimulation when not */
  playback: {
    currentTrack: Track;
    isPlaying: boolean;
    progress: number;       // 0-100
    volume: number;         // 0-100
    albumImageUrl: string | null;  // Real album art URL when authenticated
    togglePlay: () => void;
    nextTrack: () => void;
    previousTrack: () => void;
    setProgress: (val: number) => void;
    setVolume: (val: number) => void;
  };

  /** Demo page data — mock or real */
  recommendations: Recommendation[];
  topTracks: Track[];
  topArtists: Artist[];

  /** Claude-generated explanations keyed by track ID */
  explanations: Record<string, string>;

  /** Audio features keyed by track ID */
  audioFeatures: Record<string, SpotifyAudioFeature>;
}
```

### 5.3 Provider Logic

**File:** `src/context/SpotifyProvider.tsx`

```typescript
export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  // 1. On mount: check for OAuth callback code in URL
  // 2. If code found: exchange for tokens, set isAuthenticated = true
  // 3. If tokens in sessionStorage: validate, set isAuthenticated = true
  // 4. When authenticated:
  //    a. Fetch user profile via spotifyApi.getMe()
  //    b. Fetch top tracks (medium_term), top artists (medium_term)
  //    c. Use top tracks/artists as seeds for getRecommendations()
  //    d. Fetch audio features for recommended tracks
  //    e. For each recommendation, call POST /api/explain with track data + audio features + user top genres
  //    f. Map Spotify API data to existing app types (Track, Artist, Album, Recommendation)
  //    g. Initialize the Web Playback SDK
  // 5. When NOT authenticated:
  //    a. Use existing mock data from src/data/ (current behavior)
  //    b. Use usePlaybackSimulation for playback
}
```

### 5.4 Data Mapping — Spotify API to App Types

The existing `src/data/types.ts` interfaces are compatible with Spotify API data with simple mapping functions. No changes to existing interfaces are needed.

**File:** `src/services/dataMappers.ts`

```typescript
import type { Track, Artist, Album, Recommendation } from '../data/types';
import type { SpotifyTrack, SpotifyArtist, SpotifyAudioFeature } from './spotifyTypes';

/** Map a Spotify track to the app's Track interface */
export function mapSpotifyTrack(st: SpotifyTrack): Track {
  return {
    id: st.id,
    title: st.name,
    artistId: st.artists[0]?.id ?? '',
    albumId: st.album.id,
    durationMs: st.duration_ms,
    popularity: st.popularity,
  };
}

/** Map a Spotify artist to the app's Artist interface */
export function mapSpotifyArtist(sa: SpotifyArtist): Artist {
  return {
    id: sa.id,
    name: sa.name,
    imageUrl: sa.images[0]?.url ?? '',
    isIndependent: false,  // Cannot determine from Spotify API; default false
    genres: sa.genres,
    monthlyListeners: 0,   // Not available from standard API
  };
}

/** Map a Spotify track's album to the app's Album interface */
export function mapSpotifyAlbum(st: SpotifyTrack): Album {
  return {
    id: st.album.id,
    title: st.album.name,
    artistId: st.artists[0]?.id ?? '',
    coverUrl: st.album.images[0]?.url ?? '',
    releaseYear: 0,         // Not in track response; not critical
    dominantColor: '#1a1a5e', // Fallback; could extract from image later
  };
}

/** Build a Recommendation from Spotify data + Claude explanation */
export function buildLiveRecommendation(
  spotifyTrack: SpotifyTrack,
  spotifyArtists: Map<string, SpotifyArtist>,
  audioFeature: SpotifyAudioFeature | undefined,
  claudeExplanation: string,
): Recommendation {
  const track = mapSpotifyTrack(spotifyTrack);
  const artist = spotifyArtists.has(spotifyTrack.artists[0]?.id)
    ? mapSpotifyArtist(spotifyArtists.get(spotifyTrack.artists[0].id)!)
    : { id: spotifyTrack.artists[0]?.id ?? '', name: spotifyTrack.artists[0]?.name ?? '', imageUrl: '', isIndependent: false, genres: [], monthlyListeners: 0 };
  const album = mapSpotifyAlbum(spotifyTrack);

  // Generate algorithm factors from audio features
  const factors = audioFeature ? [
    { name: 'Listening History', weight: 0.35, description: 'Based on your past listening patterns' },
    { name: 'Audio Features', weight: 0.25, description: `Energy ${(audioFeature.energy * 100).toFixed(0)}%, Danceability ${(audioFeature.danceability * 100).toFixed(0)}%` },
    { name: 'Collaborative Filtering', weight: 0.20, description: 'Similar listeners also enjoy this' },
    { name: 'Genre Match', weight: 0.15, description: `Matches genres in your library` },
    { name: 'Recency', weight: 0.05, description: 'Release timing and trending factor' },
  ] : [];

  const topFactor = factors.length > 0 ? factors[0].description : 'Recommended for you';

  return {
    track,
    artist,
    album,
    decision: {
      id: `live-decision-${spotifyTrack.id}`,
      type: 'discover_weekly',
      timestamp: new Date().toISOString(),
      description: `Recommended "${spotifyTrack.name}" based on your listening profile`,
      factors,
      confidence: 0.85,
      trackIds: [spotifyTrack.id],
      explanationId: `live-explanation-${spotifyTrack.id}`,
    },
    explanation: {
      id: `live-explanation-${spotifyTrack.id}`,
      decisionId: `live-decision-${spotifyTrack.id}`,
      basic: claudeExplanation,
      detailed: claudeExplanation,
      technical: claudeExplanation,
      disclosureBoundary: 'Exact collaborative filtering weights and neural network internals are proprietary.',
      generatedAt: new Date().toISOString(),
    },
    topFactor,
  };
}
```

### 5.5 Explanation Flow

When authenticated, after recommendations are fetched:

1. Fetch audio features for all recommended track IDs in a single batch call
2. Determine user's top genres from their top artists
3. For each recommended track, POST to `/api/explain`:
   ```json
   {
     "trackName": "Kyoto",
     "artistName": "Phoebe Bridgers",
     "audioFeatures": { "danceability": 0.68, "energy": 0.72, "valence": 0.55, ... },
     "userTopGenres": ["indie rock", "indie pop", "alternative"],
     "matchReasons": ["Similar listeners also enjoy this", "Audio features match your taste"]
   }
   ```
4. The Express backend shells out to `claude --print` with the crafted prompt
5. Response text is stored in `explanations` map keyed by track ID
6. Explanation calls are parallelized (all fire at once, settled with `Promise.allSettled`)
7. If any individual explanation fails, that track falls back to a generic explanation string

---

## 6. UI Updates

### 6.1 Connect Spotify Button

**Location:** TopBar right side (replaces the static avatar area when unauthenticated)

When **not authenticated**:
- Green pill button: "Connect Spotify"
- Styled per Spotify primary button spec: `#1DB954` bg, black bold text, border-radius 9999px, `scale(1.04)` on hover
- Clicking triggers `spotifyAuth.initiateLogin()`

When **authenticated**:
- User avatar (real image from Spotify profile, or initials fallback)
- Display name next to avatar
- Clicking shows a small dropdown with "Disconnect" option

### 6.2 Loading States

When authenticated and data is being fetched, the DemoPage sections show:
- Skeleton pulse animation (Spotify uses subtle `#282828` to `#333333` pulse) on cards and track rows
- "Loading your music data..." text in `#b3b3b3`
- Each section loads independently as data arrives (recommendations may load before audio features)

### 6.3 Graceful Fallback

If any API call fails after authentication:
- The affected section falls back to mock data for that section only
- Other sections continue showing live data
- A subtle `#282828` info bar appears: "Some sections are showing sample data"
- This ensures the demo always works, even with spotty API connectivity

### 6.4 NowPlayingBar Updates

When authenticated with a Premium account:
- Album art: real album image URL instead of colored placeholder
- Track/artist: real data from Web Playback SDK state
- Controls: actually control playback (play/pause, skip, previous)
- Progress bar: real position tracking with seek
- Volume: real volume control

When authenticated with a free account:
- Playback SDK will not initialize (requires Premium)
- Falls back to `usePlaybackSimulation` mock playback
- A subtle indicator: "Premium required for playback" tooltip on play button

---

## 7. Component Interface Changes

### 7.1 Components That Need Modification

| Component | File | Change |
|---|---|---|
| `App.tsx` | `src/App.tsx` | Wrap with `<SpotifyProvider>`, consume context for playback state instead of `usePlaybackSimulation` directly |
| `TopBar` | `src/components/shell/TopBar.tsx` | Add `user` prop (nullable), add Connect/Disconnect button in user area |
| `NowPlayingBar` | `src/components/shell/NowPlayingBar.tsx` | Add optional `albumImageUrl` prop, render `<img>` when URL available, keep colored div fallback |
| `DemoPage` | `src/components/demo/DemoPage.tsx` | Consume `recommendations` from context instead of importing from `src/data/recommendations.ts` |
| `RecommendationList` | `src/components/demo/RecommendationList.tsx` | Add optional `albumImageUrl` per recommendation (from `album.coverUrl`), render real images when available |

### 7.2 Components That Need NO Changes

All other demo components (`DecisionCard`, `FactorBreakdown`, `FairnessSection`, `FairnessMetricCard`, `AppealSection`, `DecisionHistory`, `GlossaryPanel`, `TransparencyControls`, `HeroSection`) continue to work unchanged. They receive data through props that match the existing interfaces.

### 7.3 Types — No Changes Needed

The existing interfaces in `src/data/types.ts` (Track, Artist, Album, Recommendation, etc.) are sufficient. The `dataMappers.ts` module maps Spotify API responses into these interfaces. No type modifications are required.

---

## 8. File Structure

### 8.1 New Files

```
server/
├── index.ts                    # Express server entry point
├── prompt.ts                   # Claude prompt template builder
├── package.json                # Server dependencies
└── tsconfig.json               # Server TypeScript config

src/
├── config/
│   └── spotify.ts              # Spotify OAuth config constants
│
├── services/
│   ├── spotifyAuth.ts          # PKCE OAuth flow (login, callback, refresh, logout)
│   ├── spotifyApi.ts           # Spotify Web API wrapper (getMe, getTopTracks, etc.)
│   ├── spotifyTypes.ts         # TypeScript interfaces for Spotify API responses
│   ├── spotifyPlayer.ts        # SDK script loader
│   └── dataMappers.ts          # Map Spotify API data -> app types
│
├── context/
│   ├── SpotifyContext.tsx       # Context definition + useSpotify hook
│   └── SpotifyProvider.tsx      # Provider with auth + data fetching logic
│
├── hooks/
│   └── useSpotifyPlayer.ts     # Web Playback SDK hook
│
└── spotify-sdk.d.ts            # Global type declarations for Spotify SDK
```

### 8.2 Existing Files That Need Modification

| File | Nature of Change |
|---|---|
| `src/App.tsx` | Wrap children in `<SpotifyProvider>`, use context for playback |
| `src/components/shell/TopBar.tsx` | Add Spotify user/login UI to the right area |
| `src/components/shell/TopBar.module.css` | Styles for connect button and user display |
| `src/components/shell/NowPlayingBar.tsx` | Support real album art image |
| `src/components/shell/NowPlayingBar.module.css` | Image styling for album art |
| `src/components/demo/DemoPage.tsx` | Read recommendations from context instead of static import |
| `src/components/demo/RecommendationList.tsx` | Render real album art when available |
| `src/components/demo/RecommendationList.module.css` | Image styling for track art |

---

## 9. Implementation Order

Follow these steps sequentially. Each step produces a testable result.

### Step 1: Spotify Config + Auth Service

**Goal:** PKCE login flow works — user can click Connect, authorize on Spotify, and return with tokens.

**Files to create:**
- `src/config/spotify.ts`
- `src/services/spotifyAuth.ts`

**Test:** Call `spotifyAuth.initiateLogin()` from a button click. Complete the Spotify authorization. Verify tokens land in `sessionStorage`. Call `spotifyAuth.isAuthenticated()` and confirm it returns `true`.

### Step 2: Spotify API Service + Types

**Goal:** Can fetch real user data from Spotify API.

**Files to create:**
- `src/services/spotifyTypes.ts`
- `src/services/spotifyApi.ts`

**Test:** After authenticating, call `spotifyApi.getMe(token)`, `spotifyApi.getTopTracks(token)`, `spotifyApi.getRecommendations(token, { seedTracks: [...] })`. Log results to console.

### Step 3: Data Mappers

**Goal:** Spotify API responses map cleanly to existing app types.

**Files to create:**
- `src/services/dataMappers.ts`

**Test:** Map a Spotify track response to the app `Track` type. Verify all fields populated. Feed a mapped `Recommendation` into the existing `RecommendationList` component.

### Step 4: SpotifyContext + Provider

**Goal:** Dual-mode context works — mock data when unauthenticated, real data when authenticated.

**Files to create:**
- `src/context/SpotifyContext.tsx`
- `src/context/SpotifyProvider.tsx`

**Files to modify:**
- `src/App.tsx` — wrap with provider, consume context

**Test:** App works exactly as before when unauthenticated (mock data). After connecting Spotify, live data appears in the demo page.

### Step 5: TopBar Login UI

**Goal:** Connect/Disconnect button in the top bar.

**Files to modify:**
- `src/components/shell/TopBar.tsx`
- `src/components/shell/TopBar.module.css`

**Test:** "Connect Spotify" button visible. Clicking initiates OAuth. After auth, shows user name/avatar with disconnect option.

### Step 6: NowPlayingBar + Playback SDK

**Goal:** Real music playback for Premium users.

**Files to create:**
- `src/services/spotifyPlayer.ts`
- `src/hooks/useSpotifyPlayer.ts`
- `src/spotify-sdk.d.ts`

**Files to modify:**
- `src/components/shell/NowPlayingBar.tsx`
- `src/components/shell/NowPlayingBar.module.css`

**Test:** After connecting a Premium Spotify account, the NowPlayingBar shows real album art, and play/pause/skip actually control music. Non-premium falls back to simulation.

### Step 7: DemoPage Live Data

**Goal:** Demo page shows real recommendations with real album art.

**Files to modify:**
- `src/components/demo/DemoPage.tsx`
- `src/components/demo/RecommendationList.tsx`
- `src/components/demo/RecommendationList.module.css`

**Test:** After connecting Spotify, the "Your Recent Recommendations" section shows the user's actual personalized recommendations with real album art and track data.

### Step 8: Express Backend + Claude Explanations

**Goal:** Claude generates real recommendation explanations.

**Files to create:**
- `server/index.ts`
- `server/prompt.ts`
- `server/package.json`
- `server/tsconfig.json`

**Test:** Start the Express server. POST to `/api/explain` with track data. Receive a natural-language explanation. After full integration, each recommendation in the demo shows a Claude-generated explanation.

### Step 9: Loading States + Error Fallbacks

**Goal:** Smooth UX during data fetching, graceful degradation on failures.

**Files to modify:**
- `src/context/SpotifyProvider.tsx` — add loading and error states per section
- `src/components/demo/DemoPage.tsx` — render skeletons while loading
- `src/components/demo/DemoPage.module.css` — skeleton pulse animation

**Test:** Disconnect from internet after authenticating. Verify the app falls back to mock data per section without crashing. Reconnect and verify recovery.

---

## 10. Deployment Changes

### 10.1 Before (v1)

```
Vite build -> dist/ -> nginx serves static files on port 80
```

### 10.2 After (v2)

```
Vite build -> dist/ -> Express serves dist/ + /api/explain on port 80
```

### 10.3 Deployment Script

```bash
# On the DigitalOcean droplet
cd /var/www/spotify-decision

# One-time: install and authenticate Claude Code CLI
npm install -g @anthropic-ai/claude-code
claude  # Run interactively once to authenticate, then exit

# Verify the CLI works
claude -p "Say hello"

# Build frontend
npm run build

# Install server dependencies
cd server && npm install && cd ..

# Stop nginx (replaced by Express)
sudo systemctl stop nginx
sudo systemctl disable nginx

# Start Express server (use pm2 for process management)
pm2 start server/index.ts --interpreter ts-node --name spotify-decision
```

### 10.4 Spotify Developer Dashboard Setup

The user must:
1. Go to https://developer.spotify.com/dashboard
2. Create an app (or use existing)
3. Set the Redirect URI to `http://104.248.113.208/callback`
4. Copy the Client ID into `src/config/spotify.ts`
5. Note: **No Client Secret is used** — PKCE flow does not require it

---

## Decision References

This addendum introduces the following new decisions (see `artifacts/context/decision-log.md`):

| D-ID | Decision |
|---|---|
| D-011 | Express replaces nginx for serving static files + API |
| D-012 | Client-side PKCE OAuth (no backend auth) |
| D-013 | Web Playback SDK for browser-based playback |
| D-014 | Dual-mode context (mock fallback + live data) |
| D-015 | Claude Code CLI (`-p`) for generating explanations — no Anthropic SDK or API key |
