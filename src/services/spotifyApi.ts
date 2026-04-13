import { spotifyAuth } from './spotifyAuth';
import type {
  SpotifyUser,
  SpotifyTopTracks,
  SpotifyTopArtists,
  SpotifyRecentlyPlayed,
  SpotifyRecommendations,
  SpotifyAudioFeatures,
  SpotifyTrack,
  SpotifyArtist,
} from './spotifyTypes';

const BASE_URL = 'https://api.spotify.com/v1';

async function spotifyFetch<T>(
  endpoint: string,
  token: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    const refreshed = await spotifyAuth.refreshAccessToken();
    if (!refreshed) throw new Error('Authentication expired');

    const retry = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${refreshed.accessToken}`,
        ...options?.headers,
      },
    });

    if (!retry.ok) throw new Error(`Spotify API error: ${retry.status}`);
    return retry.json() as Promise<T>;
  }

  if (!response.ok) throw new Error(`Spotify API error: ${response.status}`);
  return response.json() as Promise<T>;
}

export const spotifyApi = {
  getMe(token: string): Promise<SpotifyUser> {
    return spotifyFetch<SpotifyUser>('/me', token);
  },

  getTopTracks(
    token: string,
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  ): Promise<SpotifyTopTracks> {
    return spotifyFetch<SpotifyTopTracks>(
      `/me/top/tracks?time_range=${timeRange}&limit=20`,
      token,
    );
  },

  getTopArtists(
    token: string,
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
  ): Promise<SpotifyTopArtists> {
    return spotifyFetch<SpotifyTopArtists>(
      `/me/top/artists?time_range=${timeRange}&limit=20`,
      token,
    );
  },

  getRecentlyPlayed(token: string): Promise<SpotifyRecentlyPlayed> {
    return spotifyFetch<SpotifyRecentlyPlayed>(
      '/me/player/recently-played?limit=20',
      token,
    );
  },

  getRecommendations(
    token: string,
    params: { seedTracks?: string[]; seedArtists?: string[]; seedGenres?: string[] },
  ): Promise<SpotifyRecommendations> {
    const query = new URLSearchParams();
    if (params.seedTracks?.length) query.set('seed_tracks', params.seedTracks.slice(0, 2).join(','));
    if (params.seedArtists?.length) query.set('seed_artists', params.seedArtists.slice(0, 2).join(','));
    if (params.seedGenres?.length) query.set('seed_genres', params.seedGenres.slice(0, 1).join(','));
    query.set('limit', '10');

    return spotifyFetch<SpotifyRecommendations>(
      `/recommendations?${query.toString()}`,
      token,
    );
  },

  getAudioFeatures(token: string, trackIds: string[]): Promise<SpotifyAudioFeatures> {
    return spotifyFetch<SpotifyAudioFeatures>(
      `/audio-features?ids=${trackIds.join(',')}`,
      token,
    );
  },

  getTrack(token: string, id: string): Promise<SpotifyTrack> {
    return spotifyFetch<SpotifyTrack>(`/tracks/${id}`, token);
  },

  getArtist(token: string, id: string): Promise<SpotifyArtist> {
    return spotifyFetch<SpotifyArtist>(`/artists/${id}`, token);
  },
};
