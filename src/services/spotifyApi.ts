import type {
  SpotifyUser,
  SpotifyTopTracks,
  SpotifyTopArtists,
  SpotifyRecommendations,
} from './spotifyTypes';

async function proxyGet<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export const spotifyApi = {
  getMe(_token?: string): Promise<SpotifyUser> {
    return proxyGet('/api/spotify/me');
  },

  getTopTracks(_token?: string): Promise<SpotifyTopTracks> {
    return proxyGet('/api/spotify/top-tracks');
  },

  getTopArtists(_token?: string): Promise<SpotifyTopArtists> {
    return proxyGet('/api/spotify/top-artists');
  },

  getForYou(): Promise<SpotifyRecommendations> {
    return proxyGet('/api/spotify/for-you');
  },
};
