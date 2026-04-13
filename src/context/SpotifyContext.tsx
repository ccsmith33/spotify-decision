import { createContext, useContext } from 'react';
import type { Track, Artist, Recommendation } from '../data/types';
import type { SpotifyAudioFeature } from '../services/spotifyTypes';

export interface SpotifyContextValue {
  isAuthenticated: boolean;
  isConnected: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  login: () => Promise<void>;
  logout: () => void;
  refreshData: () => Promise<void>;

  user: {
    displayName: string;
    avatarUrl: string | null;
    isPremium: boolean;
  } | null;

  playback: {
    currentTrack: Track;
    isPlaying: boolean;
    progress: number;
    volume: number;
    albumImageUrl: string | null;
    togglePlay: () => void;
    nextTrack: () => void;
    previousTrack: () => void;
    setProgress: (val: number) => void;
    setVolume: (val: number) => void;
  };

  recommendations: Recommendation[];
  topTracks: Track[];
  topArtists: Artist[];
  explanations: Record<string, string>;
  audioFeatures: Record<string, SpotifyAudioFeature>;
}

const SpotifyContext = createContext<SpotifyContextValue | null>(null);

export function useSpotify(): SpotifyContextValue {
  const ctx = useContext(SpotifyContext);
  if (!ctx) throw new Error('useSpotify must be used within SpotifyProvider');
  return ctx;
}

export { SpotifyContext };
