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
