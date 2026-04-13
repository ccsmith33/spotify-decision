import { SPOTIFY_CONFIG } from '../config/spotify';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

const STORAGE_KEYS = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expiresAt: 'spotify_expires_at',
  codeVerifier: 'spotify_code_verifier',
} as const;

function generateCodeVerifier(): string {
  const array = new Uint8Array(64);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'[byte % 66]
  ).join('');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const spotifyAuth = {
  async initiateLogin(): Promise<void> {
    const verifier = generateCodeVerifier();
    sessionStorage.setItem(STORAGE_KEYS.codeVerifier, verifier);
    const challenge = await generateCodeChallenge(verifier);

    const params = new URLSearchParams({
      client_id: SPOTIFY_CONFIG.clientId,
      response_type: 'code',
      redirect_uri: SPOTIFY_CONFIG.redirectUri,
      scope: SPOTIFY_CONFIG.scopes.join(' '),
      code_challenge_method: 'S256',
      code_challenge: challenge,
    });

    window.location.href = `${SPOTIFY_CONFIG.authEndpoint}?${params.toString()}`;
  },

  async handleCallback(): Promise<AuthTokens | null> {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) return null;

    const verifier = sessionStorage.getItem(STORAGE_KEYS.codeVerifier);
    if (!verifier) return null;

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: SPOTIFY_CONFIG.redirectUri,
      client_id: SPOTIFY_CONFIG.clientId,
      code_verifier: verifier,
    });

    const response = await fetch(SPOTIFY_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      console.error('Token exchange failed:', response.status);
      return null;
    }

    const data = await response.json();
    const tokens: AuthTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    sessionStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
    sessionStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    sessionStorage.setItem(STORAGE_KEYS.expiresAt, tokens.expiresAt.toString());
    sessionStorage.removeItem(STORAGE_KEYS.codeVerifier);

    // Clean the URL
    window.history.replaceState({}, document.title, '/');

    return tokens;
  },

  async getAccessToken(): Promise<string | null> {
    const token = sessionStorage.getItem(STORAGE_KEYS.accessToken);
    const expiresAt = sessionStorage.getItem(STORAGE_KEYS.expiresAt);

    if (!token || !expiresAt) return null;

    // Refresh if within 5 minutes of expiry
    if (Date.now() > Number(expiresAt) - 5 * 60 * 1000) {
      const refreshed = await this.refreshAccessToken();
      return refreshed ? refreshed.accessToken : null;
    }

    return token;
  },

  async refreshAccessToken(): Promise<AuthTokens | null> {
    const refreshToken = sessionStorage.getItem(STORAGE_KEYS.refreshToken);
    if (!refreshToken) return null;

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: SPOTIFY_CONFIG.clientId,
    });

    const response = await fetch(SPOTIFY_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!response.ok) {
      this.logout();
      return null;
    }

    const data = await response.json();
    const tokens: AuthTokens = {
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? refreshToken,
      expiresAt: Date.now() + data.expires_in * 1000,
    };

    sessionStorage.setItem(STORAGE_KEYS.accessToken, tokens.accessToken);
    sessionStorage.setItem(STORAGE_KEYS.refreshToken, tokens.refreshToken);
    sessionStorage.setItem(STORAGE_KEYS.expiresAt, tokens.expiresAt.toString());

    return tokens;
  },

  logout(): void {
    sessionStorage.removeItem(STORAGE_KEYS.accessToken);
    sessionStorage.removeItem(STORAGE_KEYS.refreshToken);
    sessionStorage.removeItem(STORAGE_KEYS.expiresAt);
    sessionStorage.removeItem(STORAGE_KEYS.codeVerifier);
  },

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem(STORAGE_KEYS.accessToken);
    const expiresAt = sessionStorage.getItem(STORAGE_KEYS.expiresAt);
    return !!token && !!expiresAt && Date.now() < Number(expiresAt);
  },
};
