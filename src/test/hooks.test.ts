import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlaybackSimulation } from '../hooks/usePlaybackSimulation';

describe('usePlaybackSimulation', () => {
  it('returns initial playback state', () => {
    const { result } = renderHook(() => usePlaybackSimulation());
    expect(result.current.currentTrack).toBeDefined();
    expect(result.current.isPlaying).toBe(true);
    expect(result.current.progress).toBe(0);
    expect(result.current.volume).toBe(65);
  });

  it('togglePlay toggles isPlaying', () => {
    const { result } = renderHook(() => usePlaybackSimulation());
    act(() => {
      result.current.togglePlay();
    });
    expect(result.current.isPlaying).toBe(false);
    act(() => {
      result.current.togglePlay();
    });
    expect(result.current.isPlaying).toBe(true);
  });

  it('setVolume changes volume', () => {
    const { result } = renderHook(() => usePlaybackSimulation());
    act(() => {
      result.current.setVolume(80);
    });
    expect(result.current.volume).toBe(80);
  });

  it('setProgress changes progress', () => {
    const { result } = renderHook(() => usePlaybackSimulation());
    act(() => {
      result.current.setProgress(50);
    });
    expect(result.current.progress).toBe(50);
  });

  it('advances progress when playing', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePlaybackSimulation());

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.progress).toBeGreaterThan(0);
    vi.useRealTimers();
  });
});
