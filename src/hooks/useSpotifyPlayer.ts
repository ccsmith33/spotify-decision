import { useState, useEffect, useCallback, useRef } from 'react';
import { loadSpotifySDK } from '../services/spotifyPlayer';

interface SpotifyPlayerTrack {
  name: string;
  artists: string[];
  albumName: string;
  albumImageUrl: string;
  durationMs: number;
  uri: string;
}

interface SpotifyPlayerState {
  player: Spotify.Player | null;
  deviceId: string | null;
  isPlaying: boolean;
  currentTrack: SpotifyPlayerTrack | null;
  positionMs: number;
  volume: number;
  isReady: boolean;
  play: (uri: string) => Promise<void>;
  togglePlay: () => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
  setVolume: (volume: number) => Promise<void>;
}

async function getServerToken(): Promise<string | null> {
  try {
    const res = await fetch('/api/spotify/token');
    if (res.ok) {
      const data = await res.json();
      return data.accessToken ?? null;
    }
  } catch {
    // Token not available
  }
  return null;
}

export function useSpotifyPlayer(accessToken: string | null): SpotifyPlayerState {
  const [player, setPlayer] = useState<Spotify.Player | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyPlayerTrack | null>(null);
  const [positionMs, setPositionMs] = useState(0);
  const [volume, setVolumeState] = useState(0.65);
  const [isReady, setIsReady] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const positionRef = useRef<number>(0);

  useEffect(() => {
    if (!accessToken) return;

    let playerInstance: Spotify.Player | null = null;

    const init = async () => {
      await loadSpotifySDK();

      playerInstance = new window.Spotify.Player({
        name: 'Decision Transparency Portal',
        getOAuthToken: async (cb) => {
          // Get a fresh token from the server each time the SDK needs one
          const token = await getServerToken();
          if (token) cb(token);
        },
        volume: 0.65,
      });

      playerInstance.addListener('ready', ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
        setIsReady(true);

        // Transfer playback to this device
        getServerToken().then((token) => {
          if (token) {
            fetch('https://api.spotify.com/v1/me/player', {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ device_ids: [device_id], play: false }),
            });
          }
        });
      });

      playerInstance.addListener('not_ready', () => {
        setDeviceId(null);
        setIsReady(false);
      });

      playerInstance.addListener(
        'player_state_changed',
        (state: Spotify.PlaybackState | null) => {
          if (!state) return;

          setIsPlaying(!state.paused);
          positionRef.current = state.position;
          lastUpdateRef.current = performance.now();
          setPositionMs(state.position);

          const track = state.track_window.current_track;
          if (track) {
            setCurrentTrack({
              name: track.name,
              artists: track.artists.map((a) => a.name),
              albumName: track.album.name,
              albumImageUrl: track.album.images[0]?.url ?? '',
              durationMs: track.duration_ms,
              uri: track.uri,
            });
          }
        },
      );

      playerInstance.connect();
      setPlayer(playerInstance);
    };

    init();

    return () => {
      if (playerInstance) {
        playerInstance.disconnect();
      }
    };
  }, [accessToken]);

  // Position interpolation
  useEffect(() => {
    const tick = () => {
      if (isPlaying) {
        const elapsed = performance.now() - lastUpdateRef.current;
        setPositionMs(positionRef.current + elapsed);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const play = useCallback(
    async (uri: string) => {
      const token = await getServerToken();
      if (!token || !deviceId) return;

      await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: [uri] }),
      });
    },
    [deviceId],
  );

  const togglePlay = useCallback(async () => {
    if (player) await player.togglePlay();
  }, [player]);

  const nextTrack = useCallback(async () => {
    if (player) await player.nextTrack();
  }, [player]);

  const previousTrack = useCallback(async () => {
    if (player) await player.previousTrack();
  }, [player]);

  const seek = useCallback(
    async (ms: number) => {
      if (player) await player.seek(ms);
    },
    [player],
  );

  const setVolume = useCallback(
    async (vol: number) => {
      setVolumeState(vol);
      if (player) await player.setVolume(vol);
    },
    [player],
  );

  return {
    player,
    deviceId,
    isPlaying,
    currentTrack,
    positionMs,
    volume,
    isReady,
    play,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
  };
}
