import type { Playlist } from './types';

export const playlists: Playlist[] = [
  {
    id: 'playlist-1',
    name: 'Discover Weekly',
    description: 'Your weekly mixtape of fresh music. Enjoy new discoveries and deep cuts chosen just for you.',
    coverUrl: '',
    trackIds: ['track-2', 'track-4', 'track-6', 'track-8', 'track-10'],
    isAlgorithmic: true,
  },
  {
    id: 'playlist-2',
    name: 'Daily Mix 1',
    description: 'Taylor Swift, Phoebe Bridgers, Clairo and more',
    coverUrl: '',
    trackIds: ['track-1', 'track-2', 'track-6', 'track-7', 'track-8'],
    isAlgorithmic: true,
  },
  {
    id: 'playlist-3',
    name: 'Daily Mix 2',
    description: 'Bad Bunny, Kendrick Lamar and more',
    coverUrl: '',
    trackIds: ['track-3', 'track-5', 'track-9'],
    isAlgorithmic: true,
  },
  {
    id: 'playlist-4',
    name: 'Release Radar',
    description: 'Catch all the latest music from artists you follow, plus new singles picked for you.',
    coverUrl: '',
    trackIds: ['track-6', 'track-10', 'track-1'],
    isAlgorithmic: true,
  },
  {
    id: 'playlist-5',
    name: 'Liked Songs',
    description: '47 songs',
    coverUrl: '',
    trackIds: ['track-1', 'track-2', 'track-3', 'track-4', 'track-5'],
    isAlgorithmic: false,
  },
  {
    id: 'playlist-6',
    name: 'Chill Vibes',
    description: 'Laid back beats for any mood',
    coverUrl: '',
    trackIds: ['track-2', 'track-4', 'track-6', 'track-8'],
    isAlgorithmic: false,
  },
];
