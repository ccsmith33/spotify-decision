import { useState, useEffect, useCallback, useRef } from 'react';
import type { Track } from '../data/types';
import { tracks } from '../data/tracks';

interface PlaybackState {
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  volume: number;
  togglePlay: () => void;
  setProgress: (val: number) => void;
  setVolume: (val: number) => void;
}

export function usePlaybackSimulation(): PlaybackState {
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(65);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentTrack = tracks[trackIndex];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setTrackIndex(i => (i + 1) % tracks.length);
            return 0;
          }
          return prev + (100 / (currentTrack.durationMs / 1000));
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentTrack.durationMs]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const handleSetProgress = useCallback((val: number) => {
    setProgress(val);
  }, []);

  const handleSetVolume = useCallback((val: number) => {
    setVolume(val);
  }, []);

  return {
    currentTrack,
    isPlaying,
    progress,
    volume,
    togglePlay,
    setProgress: handleSetProgress,
    setVolume: handleSetVolume,
  };
}
