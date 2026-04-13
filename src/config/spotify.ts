export const SPOTIFY_CONFIG = {
  clientId: '67ac2a8d41a04a1b9105bdd37ba477e9',
  redirectUri: 'https://spotify-portal.duckdns.org/callback',
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
