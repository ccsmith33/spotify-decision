import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Track, Artist, Recommendation } from '../data/types';
import type { SpotifyArtist, SpotifyTrack } from '../services/spotifyTypes';
import { buildLiveRecommendation, mapSpotifyTrack, mapSpotifyArtist } from '../services/dataMappers';
import type { ClaudeFactorInput } from '../services/dataMappers';
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
  factors?: ClaudeFactorInput[];
}

const defaultExplanation: ThreeTierExplanation = {
  basic: 'Recommended based on your listening patterns.',
  detailed: 'Recommended based on your listening patterns and taste profile.',
  technical: 'Recommended based on your listening patterns and taste profile. No audio feature data available.',
};

function buildFallbackExplanation(
  trackName: string,
  artistName: string,
  topGenres: string[],
  topArtistNames: string[],
  position?: number,
): ThreeTierExplanation {
  const isTopArtist = topArtistNames.some(
    a => a.toLowerCase() === artistName.toLowerCase(),
  );

  // Position-aware prefix for the basic tier
  let positionHint: string;
  if (position !== undefined && position < 3) {
    positionHint = `One of your current favorites --`;
  } else if (position !== undefined && position < 7) {
    positionHint = `A staple in your recent rotation --`;
  } else {
    positionHint = `Rising in your listening patterns --`;
  }

  if (isTopArtist) {
    return {
      basic: `${positionHint} you've been playing a lot of ${artistName}.`,
      detailed: `"${trackName}" appears because ${artistName} is one of your most-played artists. The algorithm surfaces tracks from artists you engage with frequently.`,
      technical: `"${trackName}" by ${artistName} ranked via artist-affinity score derived from your recent play history. ${artistName} is in your top-artist cluster, triggering high-confidence recommendation.`,
    };
  }

  if (topGenres.length > 0) {
    const genre = topGenres[0];
    return {
      basic: `${positionHint} ${artistName} fits your ${genre} rotation.`,
      detailed: `"${trackName}" by ${artistName} matches your interest in ${genre}. The algorithm found sonic and genre similarities to music you enjoy.`,
      technical: `"${trackName}" by ${artistName} recommended via genre-affinity vector. Your top genre cluster includes ${topGenres.slice(0, 3).join(', ')}, and this track's genre embedding has high cosine similarity.`,
    };
  }

  return {
    basic: `${positionHint} "${trackName}" by ${artistName} caught the algorithm's attention.`,
    detailed: `"${trackName}" by ${artistName} was selected based on patterns in your recent listening sessions.`,
    technical: `"${trackName}" by ${artistName} recommended via collaborative filtering on implicit feedback signals from recent session history.`,
  };
}

export function SpotifyProvider({ children }: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [playbackToken, setPlaybackToken] = useState<string | null>(null);

  const [user, setUser] = useState<SpotifyContextValue['user']>(null);
  const [liveRecommendations, setLiveRecommendations] = useState<Recommendation[]>([]);
  const [liveTopTracks, setLiveTopTracks] = useState<Track[]>([]);
  const [liveTopArtists, setLiveTopArtists] = useState<Artist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<{ track: Track; playedAt: string }[]>([]);
  const [livePlaylists, setLivePlaylists] = useState<{ id: string; name: string; imageUrl: string | null; owner: string; ownerId: string; trackCount: number }[]>([]);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [selectedPlaylist, setSelectedPlaylist] = useState<{ id: string; name: string; imageUrl: string | null; description: string } | null>(null);
  const [playlistTracks, setPlaylistTracks] = useState<Recommendation[]>([]);
  const [isLoadingPlaylist, setIsLoadingPlaylist] = useState(false);

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

      // Fetch top tracks, top artists, playlists, and recently played in parallel
      const [topTracksRes, topArtistsRes, playlistsRes, recentlyPlayedRes] = await Promise.all([
        fetch(`/api/spotify/top-tracks${refreshParam}`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`/api/spotify/top-artists${refreshParam}`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`/api/spotify/playlists${refreshParam}`).then(r => r.ok ? r.json() : null).catch(() => null),
        fetch(`/api/spotify/recently-played${refreshParam}`).then(r => r.ok ? r.json() : null).catch(() => null),
      ]);

      if (topTracksRes?.items) {
        setLiveTopTracks(topTracksRes.items.map((t: SpotifyTrack) => mapSpotifyTrack(t)));
      }

      if (topArtistsRes?.items) {
        setLiveTopArtists(topArtistsRes.items.map((a: SpotifyArtist) => mapSpotifyArtist(a)));
      }

      if (playlistsRes?.items) {
        setLivePlaylists(
          playlistsRes.items.map((p: { id: string; name: string; images: { url: string }[]; owner: { display_name: string; id: string }; tracks: { total: number } }) => ({
            id: p.id,
            name: p.name,
            imageUrl: p.images?.[0]?.url ?? null,
            owner: p.owner?.display_name ?? '',
            ownerId: p.owner?.id ?? '',
            trackCount: p.tracks?.total ?? 0,
          })),
        );
      }

      if (recentlyPlayedRes?.items) {
        setRecentlyPlayed(
          recentlyPlayedRes.items.map((item: { track: SpotifyTrack; played_at: string }) => ({
            track: mapSpotifyTrack(item.track),
            playedAt: item.played_at,
          })),
        );
      }

      // Collect genre and artist info from top artists
      const topGenres: string[] = topArtistsRes?.items?.flatMap((a: SpotifyArtist) => a.genres ?? []).slice(0, 5) ?? [];
      const uniqueGenres = [...new Set(topGenres)];
      const topArtistNames: string[] = topArtistsRes?.items?.map((a: SpotifyArtist) => a.name).slice(0, 5) ?? [];

      // Fetch personalized "for you" tracks (top tracks + recently played)
      let recTracks: SpotifyTrack[] = [];
      try {
        const forYouRes = await fetch(`/api/spotify/for-you${refreshParam}`);
        if (forYouRes.ok) {
          const forYouData = await forYouRes.json();
          recTracks = (forYouData.tracks ?? []).slice(0, 10);
        }
      } catch {
        // Fall back to mock recommendations
      }

      if (recTracks.length > 0) {
        // Build artist map
        const artistMap = new Map<string, SpotifyArtist>();
        if (topArtistsRes?.items) {
          for (const a of topArtistsRes.items) {
            artistMap.set(a.id, a);
          }
        }

        // Build a set of top-track IDs so we can determine source
        const topTrackIds = new Set(
          topTracksRes?.items?.map((t: SpotifyTrack) => t.id) ?? [],
        );

        // Fetch Claude explanations in batches of 3 (to avoid overwhelming the droplet)
        const CONCURRENCY = 3;
        type ExplanationResult = { trackId: string; explanation: ThreeTierExplanation };
        const explanationResults: PromiseSettledResult<ExplanationResult>[] = [];

        for (let i = 0; i < recTracks.length; i += CONCURRENCY) {
          const batch = recTracks.slice(i, i + CONCURRENCY);
          const batchResults = await Promise.allSettled(
            batch.map(async (track: SpotifyTrack, batchIdx: number) => {
              const index = i + batchIdx;
              const trackArtistName = track.artists[0]?.name ?? '';
              const fallback = buildFallbackExplanation(track.name, trackArtistName, uniqueGenres, topArtistNames, index);

              const source = topTrackIds.has(track.id) ? 'top_tracks' : 'recently_played';
              const artistRankIdx = topArtistNames.findIndex(
                n => n.toLowerCase() === trackArtistName.toLowerCase(),
              );

              try {
                const response = await fetch('/api/explain', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    trackName: track.name,
                    artistName: trackArtistName,
                    userTopGenres: uniqueGenres,
                    userTopArtists: topArtistNames,
                    popularity: track.popularity,
                    matchReasons: ['Based on your listening history', 'In your recent heavy rotation'],
                    position: index,
                    source,
                    artistRank: artistRankIdx >= 0 ? artistRankIdx : undefined,
                  }),
                });
                if (response.ok) {
                  const data = await response.json();
                  const exp = data.explanation;
                  if (typeof exp === 'string') {
                    return { trackId: track.id, explanation: { basic: exp, detailed: exp, technical: exp } };
                  }
                  return {
                    trackId: track.id,
                    explanation: {
                      basic: exp.basic ?? fallback.basic,
                      detailed: exp.detailed ?? fallback.detailed,
                      technical: exp.technical ?? fallback.technical,
                      factors: Array.isArray(exp.factors) ? exp.factors : undefined,
                    },
                  };
                }
                console.warn(`Claude /api/explain returned ${response.status} for "${track.name}" — using fallback`);
                return { trackId: track.id, explanation: fallback };
              } catch (err) {
                console.warn(`Claude /api/explain failed for "${track.name}":`, err);
                return { trackId: track.id, explanation: fallback };
              }
            }),
          );
          explanationResults.push(...batchResults);
        }

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
            tierExp,
            tierExp.factors,
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
    setRecentlyPlayed([]);
    setLivePlaylists([]);
    setExplanations({});
    setSelectedPlaylist(null);
    setPlaylistTracks([]);
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAllData(true);
    setIsRefreshing(false);
  }, [fetchAllData]);

  const selectPlaylist = useCallback(async (playlist: { id: string; name: string; imageUrl: string | null; description: string } | null) => {
    if (!playlist) {
      setSelectedPlaylist(null);
      setPlaylistTracks([]);
      return;
    }

    setSelectedPlaylist(playlist);
    setIsLoadingPlaylist(true);

    try {
      const res = await fetch(`/api/spotify/playlists/${playlist.id}/tracks`);
      if (!res.ok) {
        setPlaylistTracks([]);
        setIsLoadingPlaylist(false);
        return;
      }
      const data = await res.json();
      const items = data.items ?? [];

      // Build recommendations from playlist tracks
      const recs: Recommendation[] = items
        .filter((item: { track: SpotifyTrack | null }) => item.track !== null)
        .slice(0, 30)
        .map((item: { track: SpotifyTrack; added_at?: string }, index: number) => {
          const t = item.track;
          const track = mapSpotifyTrack(t);
          const artist = {
            id: t.artists[0]?.id ?? '',
            name: t.artists[0]?.name ?? '',
            imageUrl: '',
            isIndependent: false,
            genres: [] as string[],
            monthlyListeners: 0,
          };
          const album = {
            id: t.album.id,
            title: t.album.name,
            artistId: t.artists[0]?.id ?? '',
            coverUrl: t.album.images[0]?.url ?? '',
            releaseYear: 0,
            dominantColor: '#1a1a5e',
          };

          const why = `Added to "${playlist.name}" based on your listening`;

          return {
            track,
            artist,
            album,
            decision: {
              id: `playlist-${playlist.id}-track-${index}`,
              type: 'playlist_curation' as const,
              timestamp: item.added_at ?? new Date().toISOString(),
              description: `Track in "${playlist.name}"`,
              factors: [
                { name: 'Playlist Fit', weight: 0.35, description: 'Matches the playlist theme' },
                { name: 'Listening History', weight: 0.30, description: 'Based on your listening patterns' },
                { name: 'Artist Affinity', weight: 0.20, description: 'Related to artists you enjoy' },
                { name: 'Discovery', weight: 0.15, description: 'Expanding your musical horizons' },
              ],
              confidence: 0.80,
              trackIds: [t.id],
              explanationId: `playlist-exp-${playlist.id}-${index}`,
            },
            explanation: {
              id: `playlist-exp-${playlist.id}-${index}`,
              decisionId: `playlist-${playlist.id}-track-${index}`,
              basic: why,
              detailed: `"${t.name}" by ${t.artists[0]?.name ?? 'this artist'} was added to "${playlist.name}" because it fits the playlist's musical profile and your listening preferences.`,
              technical: `Track "${t.name}" selected for playlist curation based on genre embedding similarity, collaborative filtering signals, and playlist coherence scoring.`,
              disclosureBoundary: 'Playlist curation internals are proprietary.',
              generatedAt: new Date().toISOString(),
            },
            topFactor: why,
          };
        });

      setPlaylistTracks(recs);
    } catch {
      setPlaylistTracks([]);
    }

    setIsLoadingPlaylist(false);
  }, []);

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
      recentlyPlayed,
      playlists: livePlaylists,
      explanations,
      audioFeatures: {},
      selectedPlaylist,
      selectPlaylist,
      playlistTracks,
      isLoadingPlaylist,
    }),
    [
      isConnected, isLoading, isRefreshing, login, logout, refreshData, user, playback,
      liveRecommendations, liveTopTracks, liveTopArtists, recentlyPlayed, livePlaylists, explanations,
      selectedPlaylist, selectPlaylist, playlistTracks, isLoadingPlaylist,
    ],
  );

  return <SpotifyContext value={value}>{children}</SpotifyContext>;
}
