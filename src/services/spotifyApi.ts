import type {
  SpotifyUser,
  SpotifyTopTracks,
  SpotifyTopArtists,
  SpotifyRecommendations,
  SpotifyAudioFeatures,
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

  getRecommendations(
    _token: string,
    options: { seedTracks?: string[]; seedArtists?: string[]; seedGenres?: string[] },
  ): Promise<SpotifyRecommendations> {
    const params = new URLSearchParams();
    if (options.seedTracks?.length) params.set('seed_tracks', options.seedTracks.join(','));
    if (options.seedArtists?.length) params.set('seed_artists', options.seedArtists.join(','));
    if (options.seedGenres?.length) params.set('seed_genres', options.seedGenres.join(','));
    return proxyGet(`/api/spotify/recommendations?${params.toString()}`);
  },

  getAudioFeatures(_token: string, ids: string[]): Promise<SpotifyAudioFeatures> {
    return proxyGet(`/api/spotify/audio-features/${ids.join(',')}`);
  },
};
