import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Track, Artist, Recommendation } from '../data/types';
import type { SpotifyAudioFeature, SpotifyArtist, SpotifyTrack } from '../services/spotifyTypes';
import { spotifyAuth } from '../services/spotifyAuth';
import { spotifyApi } from '../services/spotifyApi';
import { buildLiveRecommendation, mapSpotifyTrack, mapSpotifyArtist } from '../services/dataMappers';
import { usePlaybackSimulation } from '../hooks/usePlaybackSimulation';
import { useSpotifyPlayer } from '../hooks/useSpotifyPlayer';
import { SpotifyContext } from './SpotifyContext';
import type { SpotifyContextValue } from './SpotifyContext';

// Import mock data for fallback
import { recommendations as mockRecommendations } from '../data/recommendations';
import { tracks as mockTracks } from '../data/tracks';

interface Props {
  children: ReactNode;
}

export function SpotifyProvider({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [user, setUser] = useState<SpotifyContextValue['user']>(null);
  const [liveRecommendations, setLiveRecommendations] = useState<Recommendation[]>([]);
  const [liveTopTracks, setLiveTopTracks] = useState<Track[]>([]);
  const [liveTopArtists, setLiveTopArtists] = useState<Artist[]>([]);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [audioFeatures, setAudioFeatures] = useState<Record<string, SpotifyAudioFeature>>({});
  const [dataLoaded, setDataLoaded] = useState(false);

  const mockPlayback = usePlaybackSimulation();
  const spotifyPlayer = useSpotifyPlayer(isAuthenticated ? accessToken : null);

  // Check for callback or existing tokens on mount
  useEffect(() => {
    const init = async () => {
      // Check for OAuth callback
      const params = new URLSearchParams(window.location.search);
      if (params.has('code')) {
        const tokens = await spotifyAuth.handleCallback();
        if (tokens) {
          setAccessToken(tokens.accessToken);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }

      // Check for existing session
      if (spotifyAuth.isAuthenticated()) {
        const token = await spotifyAuth.getAccessToken();
        if (token) {
          setAccessToken(token);
          setIsAuthenticated(true);
        }
      }

      setIsLoading(false);
    };

    init();
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (!isAuthenticated || !accessToken || dataLoaded) return;

    const fetchData = async () => {
      setIsLoading(true);

      try {
        // Fetch user profile, top tracks, and top artists in parallel
        const [userProfile, topTracksResult, topArtistsResult] = await Promise.all([
          spotifyApi.getMe(accessToken).catch(() => null),
          spotifyApi.getTopTracks(accessToken).catch(() => null),
          spotifyApi.getTopArtists(accessToken).catch(() => null),
        ]);

        if (userProfile) {
          setUser({
            displayName: userProfile.display_name,
            avatarUrl: userProfile.images[0]?.url ?? null,
            isPremium: userProfile.product === 'premium',
          });
        }

        if (topTracksResult) {
          setLiveTopTracks(topTracksResult.items.map(mapSpotifyTrack));
        }

        if (topArtistsResult) {
          setLiveTopArtists(topArtistsResult.items.map(mapSpotifyArtist));
        }

        // Get recommendations using top tracks/artists as seeds
        const seedTracks = topTracksResult?.items.slice(0, 2).map((t) => t.id) ?? [];
        const seedArtists = topArtistsResult?.items.slice(0, 2).map((a) => a.id) ?? [];
        const topGenres = topArtistsResult?.items.flatMap((a) => a.genres).slice(0, 5) ?? [];
        const uniqueGenres = [...new Set(topGenres)];

        let recTracks: SpotifyTrack[] = [];
        try {
          const recs = await spotifyApi.getRecommendations(accessToken, {
            seedTracks,
            seedArtists,
            seedGenres: uniqueGenres.slice(0, 1),
          });
          recTracks = recs.tracks;
        } catch {
          // Fall back to mock data for recommendations
        }

        if (recTracks.length > 0) {
          // Fetch audio features for recommended tracks
          let features: SpotifyAudioFeature[] = [];
          try {
            const featuresResult = await spotifyApi.getAudioFeatures(
              accessToken,
              recTracks.map((t) => t.id),
            );
            features = featuresResult.audio_features.filter(Boolean);
          } catch {
            // Continue without audio features
          }

          const featureMap: Record<string, SpotifyAudioFeature> = {};
          for (const f of features) {
            if (f) featureMap[f.id] = f;
          }
          setAudioFeatures(featureMap);

          // Build artist map from recommendation track artists
          const artistMap = new Map<string, SpotifyArtist>();
          if (topArtistsResult) {
            for (const a of topArtistsResult.items) {
              artistMap.set(a.id, a);
            }
          }

          // Fetch Claude explanations in parallel
          const explanationResults = await Promise.allSettled(
            recTracks.map(async (track) => {
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
                  return { trackId: track.id, explanation: data.explanation as string };
                }
                return { trackId: track.id, explanation: `Recommended based on your listening patterns and taste profile.` };
              } catch {
                return { trackId: track.id, explanation: `Recommended based on your listening patterns and taste profile.` };
              }
            }),
          );

          const expMap: Record<string, string> = {};
          for (const result of explanationResults) {
            if (result.status === 'fulfilled') {
              expMap[result.value.trackId] = result.value.explanation;
            }
          }
          setExplanations(expMap);

          // Build live recommendations
          const recs = recTracks.map((track) =>
            buildLiveRecommendation(
              track,
              artistMap,
              featureMap[track.id],
              expMap[track.id] ?? 'Recommended based on your listening patterns and taste profile.',
            ),
          );
          setLiveRecommendations(recs);
        }

        setDataLoaded(true);
      } catch (error) {
        console.error('Error fetching Spotify data:', error);
        setDataLoaded(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, accessToken, dataLoaded]);

  const login = useCallback(async () => {
    await spotifyAuth.initiateLogin();
  }, []);

  const logout = useCallback(() => {
    spotifyAuth.logout();
    setIsAuthenticated(false);
    setAccessToken(null);
    setUser(null);
    setLiveRecommendations([]);
    setLiveTopTracks([]);
    setLiveTopArtists([]);
    setExplanations({});
    setAudioFeatures({});
    setDataLoaded(false);
  }, []);

  // Build playback from either Spotify player or mock
  const playback = useMemo((): SpotifyContextValue['playback'] => {
    if (isAuthenticated && spotifyPlayer.isReady && spotifyPlayer.currentTrack) {
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
  }, [isAuthenticated, spotifyPlayer, mockPlayback]);

  const value = useMemo(
    (): SpotifyContextValue => ({
      isAuthenticated,
      isLoading,
      login,
      logout,
      user,
      playback,
      recommendations: isAuthenticated && liveRecommendations.length > 0
        ? liveRecommendations
        : mockRecommendations,
      topTracks: isAuthenticated && liveTopTracks.length > 0 ? liveTopTracks : mockTracks,
      topArtists: liveTopArtists,
      explanations,
      audioFeatures,
    }),
    [
      isAuthenticated, isLoading, login, logout, user, playback,
      liveRecommendations, liveTopTracks, liveTopArtists, explanations, audioFeatures,
    ],
  );

  return <SpotifyContext value={value}>{children}</SpotifyContext>;
}
