import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Track, Artist, Recommendation } from '../data/types';
import type { SpotifyAudioFeature, SpotifyArtist, SpotifyTrack } from '../services/spotifyTypes';
import { buildLiveRecommendation, mapSpotifyTrack, mapSpotifyArtist } from '../services/dataMappers';
import { usePlaybackSimulation } from '../hooks/usePlaybackSimulation';
import { useSpotifyPlayer } from '../hooks/useSpotifyPlayer';
import { SpotifyContext } from './SpotifyContext';
import type { SpotifyContextValue } from './SpotifyContext';

import { recommendations as mockRecommendations } from '../data/recommendations';
import { tracks as mockTracks } from '../data/tracks';

interface Props {
  children: ReactNode;
}

interface ThreeTierExplanation {
  basic: string;
  detailed: string;
  technical: string;
}

const defaultExplanation: ThreeTierExplanation = {
  basic: 'Recommended based on your listening patterns.',
  detailed: 'Recommended based on your listening patterns and taste profile.',
  technical: 'Recommended based on your listening patterns and taste profile. No audio feature data available.',
};

export function SpotifyProvider({ children }: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [playbackToken, setPlaybackToken] = useState<string | null>(null);

  const [user, setUser] = useState<SpotifyContextValue['user']>(null);
  const [liveRecommendations, setLiveRecommendations] = useState<Recommendation[]>([]);
  const [liveTopTracks, setLiveTopTracks] = useState<Track[]>([]);
  const [liveTopArtists, setLiveTopArtists] = useState<Artist[]>([]);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [audioFeatures, setAudioFeatures] = useState<Record<string, SpotifyAudioFeature>>({});

  const mockPlayback = usePlaybackSimulation();
  const spotifyPlayer = useSpotifyPlayer(playbackToken);

  const fetchAllData = useCallback(async (forceRefresh = false) => {
    const refreshParam = forceRefresh ? '?refresh=true' : '';

    try {
      // Check if Spotify is connected by fetching user profile
      const meResponse = await fetch(`/api/spotify/me${refreshParam}`);
      if (!meResponse.ok) {
        setIsConnected(false);
        return;
      }

      const userProfile = await meResponse.json();
      setUser({
        displayName: userProfile.display_name,
        avatarUrl: userProfile.images?.[0]?.url ?? null,
        isPremium: userProfile.product === 'premium',
      });
      setIsConnected(true);

      // Get a playback token for the Web Playback SDK
      try {
        const tokenResponse = await fetch('/api/spotify/token');
        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          setPlaybackToken(tokenData.accessToken);
        }
      } catch {
        // Playback won't work but data will
      }

      // Fetch top tracks and top artists in parallel
      const [topTracksRes, topArtistsRes] = await Promise.all([
        fetch(`/api/spotify/top-tracks${refreshParam}`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`/api/spotify/top-artists${refreshParam}`).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);

      if (topTracksRes?.items) {
        setLiveTopTracks(topTracksRes.items.map((t: SpotifyTrack) => mapSpotifyTrack(t)));
      }

      if (topArtistsRes?.items) {
        setLiveTopArtists(topArtistsRes.items.map((a: SpotifyArtist) => mapSpotifyArtist(a)));
      }

      // Build recommendation seeds
      const seedTracks = topTracksRes?.items?.slice(0, 2).map((t: SpotifyTrack) => t.id) ?? [];
      const seedArtists = topArtistsRes?.items?.slice(0, 2).map((a: SpotifyArtist) => a.id) ?? [];
      const topGenres: string[] = topArtistsRes?.items?.flatMap((a: SpotifyArtist) => a.genres).slice(0, 5) ?? [];
      const uniqueGenres = [...new Set(topGenres)];

      // Fetch recommendations
      let recTracks: SpotifyTrack[] = [];
      try {
        const recParams = new URLSearchParams();
        if (seedTracks.length) recParams.set('seed_tracks', seedTracks.join(','));
        if (seedArtists.length) recParams.set('seed_artists', seedArtists.join(','));
        if (uniqueGenres.length) recParams.set('seed_genres', uniqueGenres.slice(0, 1).join(','));
        recParams.set('limit', '10');
        if (forceRefresh) recParams.set('refresh', 'true');

        const recRes = await fetch(`/api/spotify/recommendations?${recParams.toString()}`);
        if (recRes.ok) {
          const recData = await recRes.json();
          recTracks = recData.tracks ?? [];
        }
      } catch {
        // Fall back to mock recommendations
      }

      if (recTracks.length > 0) {
        // Fetch audio features
        let features: SpotifyAudioFeature[] = [];
        try {
          const ids = recTracks.map(t => t.id).join(',');
          const afRes = await fetch(`/api/spotify/audio-features/${ids}${refreshParam}`);
          if (afRes.ok) {
            const afData = await afRes.json();
            features = (afData.audio_features ?? []).filter(Boolean);
          }
        } catch {
          // Continue without audio features
        }

        const featureMap: Record<string, SpotifyAudioFeature> = {};
        for (const f of features) {
          if (f) featureMap[f.id] = f;
        }
        setAudioFeatures(featureMap);

        // Build artist map
        const artistMap = new Map<string, SpotifyArtist>();
        if (topArtistsRes?.items) {
          for (const a of topArtistsRes.items) {
            artistMap.set(a.id, a);
          }
        }

        // Fetch Claude explanations in parallel (now three-tier)
        const explanationResults = await Promise.allSettled(
          recTracks.map(async (track: SpotifyTrack) => {
            const af = featureMap[track.id];
            try {
              const response = await fetch('/api/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  trackName: track.name,
                  artistName: track.artists[0]?.name ?? '',
                  audioFeatures: af
                    ? {
                        danceability: af.danceability,
                        energy: af.energy,
                        valence: af.valence,
                        tempo: af.tempo,
                        acousticness: af.acousticness,
                        instrumentalness: af.instrumentalness,
                      }
                    : undefined,
                  userTopGenres: uniqueGenres,
                  matchReasons: ['Based on your listening history', 'Similar listeners also enjoy this'],
                }),
              });
              if (response.ok) {
                const data = await response.json();
                const exp = data.explanation;
                // Handle both old (string) and new (object) response formats
                if (typeof exp === 'string') {
                  return { trackId: track.id, explanation: { basic: exp, detailed: exp, technical: exp } };
                }
                return {
                  trackId: track.id,
                  explanation: {
                    basic: exp.basic ?? defaultExplanation.basic,
                    detailed: exp.detailed ?? defaultExplanation.detailed,
                    technical: exp.technical ?? defaultExplanation.technical,
                  },
                };
              }
              return { trackId: track.id, explanation: defaultExplanation };
            } catch {
              return { trackId: track.id, explanation: defaultExplanation };
            }
          }),
        );

        const expMap: Record<string, ThreeTierExplanation> = {};
        const legacyExpMap: Record<string, string> = {};
        for (const result of explanationResults) {
          if (result.status === 'fulfilled') {
            expMap[result.value.trackId] = result.value.explanation;
            legacyExpMap[result.value.trackId] = result.value.explanation.basic;
          }
        }
        setExplanations(legacyExpMap);

        // Build live recommendations with three-tier explanations
        const recs = recTracks.map((track: SpotifyTrack) => {
          const tierExp = expMap[track.id] ?? defaultExplanation;
          return buildLiveRecommendation(
            track,
            artistMap,
            featureMap[track.id],
            tierExp,
          );
        });
        setLiveRecommendations(recs);
      }
    } catch (error) {
      console.error('Error fetching Spotify data:', error);
      setIsConnected(false);
    }
  }, []);

  // On mount: check if server has Spotify connected, then fetch all data
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await fetchAllData(false);
      setIsLoading(false);
    };
    init();
  }, [fetchAllData]);

  const login = useCallback(async () => {
    window.location.href = '/auth/login';
  }, []);

  const logout = useCallback(() => {
    setIsConnected(false);
    setPlaybackToken(null);
    setUser(null);
    setLiveRecommendations([]);
    setLiveTopTracks([]);
    setLiveTopArtists([]);
    setExplanations({});
    setAudioFeatures({});
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAllData(true);
    setIsRefreshing(false);
  }, [fetchAllData]);

  const playback = useMemo((): SpotifyContextValue['playback'] => {
    if (isConnected && spotifyPlayer.isReady && spotifyPlayer.currentTrack) {
      const sdkTrack = spotifyPlayer.currentTrack;
      const track: Track = {
        id: sdkTrack.uri,
        title: sdkTrack.name,
        artistId: '',
        albumId: '',
        durationMs: sdkTrack.durationMs,
        popularity: 0,
      };
      const progress =
        sdkTrack.durationMs > 0 ? (spotifyPlayer.positionMs / sdkTrack.durationMs) * 100 : 0;

      return {
        currentTrack: track,
        isPlaying: spotifyPlayer.isPlaying,
        progress,
        volume: spotifyPlayer.volume * 100,
        albumImageUrl: sdkTrack.albumImageUrl,
        togglePlay: () => { spotifyPlayer.togglePlay(); },
        nextTrack: () => { spotifyPlayer.nextTrack(); },
        previousTrack: () => { spotifyPlayer.previousTrack(); },
        setProgress: (val: number) => {
          if (sdkTrack.durationMs > 0) {
            spotifyPlayer.seek((val / 100) * sdkTrack.durationMs);
          }
        },
        setVolume: (val: number) => { spotifyPlayer.setVolume(val / 100); },
      };
    }

    return {
      currentTrack: mockPlayback.currentTrack,
      isPlaying: mockPlayback.isPlaying,
      progress: mockPlayback.progress,
      volume: mockPlayback.volume,
      albumImageUrl: null,
      togglePlay: mockPlayback.togglePlay,
      nextTrack: () => {},
      previousTrack: () => {},
      setProgress: mockPlayback.setProgress,
      setVolume: mockPlayback.setVolume,
    };
  }, [isConnected, spotifyPlayer, mockPlayback]);

  const value = useMemo(
    (): SpotifyContextValue => ({
      isAuthenticated: isConnected,
      isConnected,
      isLoading,
      isRefreshing,
      login,
      logout,
      refreshData,
      user,
      playback,
      recommendations: isConnected && liveRecommendations.length > 0
        ? liveRecommendations
        : mockRecommendations,
      topTracks: isConnected && liveTopTracks.length > 0 ? liveTopTracks : mockTracks,
      topArtists: liveTopArtists,
      explanations,
      audioFeatures,
    }),
    [
      isConnected, isLoading, isRefreshing, login, logout, refreshData, user, playback,
      liveRecommendations, liveTopTracks, liveTopArtists, explanations, audioFeatures,
    ],
  );

  return <SpotifyContext value={value}>{children}</SpotifyContext>;
}
