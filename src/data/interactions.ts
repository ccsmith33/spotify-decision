import type { Interaction } from './types';

export const interactions: Interaction[] = [
  { id: 'int-1', trackId: 'track-1', type: 'play', timestamp: '2026-04-13T08:15:00Z', context: 'Daily Mix 1', durationMs: 200000 },
  { id: 'int-2', trackId: 'track-2', type: 'play', timestamp: '2026-04-13T08:18:00Z', context: 'Discover Weekly', durationMs: 214000 },
  { id: 'int-3', trackId: 'track-3', type: 'skip', timestamp: '2026-04-13T08:22:00Z', context: 'Daily Mix 2', durationMs: 32000 },
  { id: 'int-4', trackId: 'track-4', type: 'like', timestamp: '2026-04-12T19:30:00Z', context: 'Discover Weekly' },
  { id: 'int-5', trackId: 'track-5', type: 'play', timestamp: '2026-04-12T19:32:00Z', context: 'Home Feed', durationMs: 195000 },
  { id: 'int-6', trackId: 'track-6', type: 'save', timestamp: '2026-04-12T19:35:00Z', context: 'Release Radar' },
  { id: 'int-7', trackId: 'track-7', type: 'play', timestamp: '2026-04-12T14:00:00Z', context: 'Daily Mix 1', durationMs: 202000 },
  { id: 'int-8', trackId: 'track-8', type: 'play', timestamp: '2026-04-12T14:03:00Z', context: 'Discover Weekly', durationMs: 180000 },
  { id: 'int-9', trackId: 'track-9', type: 'skip', timestamp: '2026-04-12T14:06:00Z', context: 'Daily Mix 2', durationMs: 15000 },
  { id: 'int-10', trackId: 'track-10', type: 'play', timestamp: '2026-04-11T20:00:00Z', context: 'Discover Weekly', durationMs: 225000 },
  { id: 'int-11', trackId: 'track-1', type: 'add_to_playlist', timestamp: '2026-04-11T20:04:00Z', context: 'Liked Songs' },
  { id: 'int-12', trackId: 'track-2', type: 'share', timestamp: '2026-04-11T16:30:00Z', context: 'Song Radio' },
  { id: 'int-13', trackId: 'track-4', type: 'play', timestamp: '2026-04-10T22:00:00Z', context: 'Release Radar', durationMs: 211000 },
  { id: 'int-14', trackId: 'track-6', type: 'like', timestamp: '2026-04-10T22:04:00Z', context: 'Release Radar' },
  { id: 'int-15', trackId: 'track-3', type: 'play', timestamp: '2026-04-10T15:00:00Z', context: 'Search', durationMs: 243000 },
  { id: 'int-16', trackId: 'track-5', type: 'play', timestamp: '2026-04-09T21:00:00Z', context: 'Home Feed', durationMs: 195000 },
  { id: 'int-17', trackId: 'track-8', type: 'like', timestamp: '2026-04-09T21:04:00Z', context: 'Discover Weekly' },
  { id: 'int-18', trackId: 'track-7', type: 'play', timestamp: '2026-04-09T12:00:00Z', context: 'Daily Mix 1', durationMs: 202000 },
  { id: 'int-19', trackId: 'track-9', type: 'play', timestamp: '2026-04-08T18:00:00Z', context: 'Home Feed', durationMs: 254000 },
  { id: 'int-20', trackId: 'track-10', type: 'save', timestamp: '2026-04-08T18:04:00Z', context: 'Discover Weekly' },
];
