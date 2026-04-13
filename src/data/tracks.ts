import type { Artist, Album, Track } from './types';

export const artists: Artist[] = [
  {
    id: 'artist-1',
    name: 'Taylor Swift',
    imageUrl: '',
    isIndependent: false,
    genres: ['pop', 'country pop'],
    monthlyListeners: 82000000,
  },
  {
    id: 'artist-2',
    name: 'Phoebe Bridgers',
    imageUrl: '',
    isIndependent: true,
    genres: ['indie rock', 'indie folk'],
    monthlyListeners: 8500000,
  },
  {
    id: 'artist-3',
    name: 'Bad Bunny',
    imageUrl: '',
    isIndependent: false,
    genres: ['reggaeton', 'latin trap'],
    monthlyListeners: 65000000,
  },
  {
    id: 'artist-4',
    name: 'Japanese Breakfast',
    imageUrl: '',
    isIndependent: true,
    genres: ['indie pop', 'shoegaze'],
    monthlyListeners: 3200000,
  },
  {
    id: 'artist-5',
    name: 'Kendrick Lamar',
    imageUrl: '',
    isIndependent: false,
    genres: ['hip hop', 'conscious rap'],
    monthlyListeners: 55000000,
  },
  {
    id: 'artist-6',
    name: 'Clairo',
    imageUrl: '',
    isIndependent: true,
    genres: ['bedroom pop', 'indie pop'],
    monthlyListeners: 12000000,
  },
];

export const albums: Album[] = [
  {
    id: 'album-1',
    title: 'Midnights',
    artistId: 'artist-1',
    coverUrl: '',
    releaseYear: 2022,
    dominantColor: '#1a1a5e',
  },
  {
    id: 'album-2',
    title: 'Punisher',
    artistId: 'artist-2',
    coverUrl: '',
    releaseYear: 2020,
    dominantColor: '#4a2c6e',
  },
  {
    id: 'album-3',
    title: 'Un Verano Sin Ti',
    artistId: 'artist-3',
    coverUrl: '',
    releaseYear: 2022,
    dominantColor: '#2d6b4f',
  },
  {
    id: 'album-4',
    title: 'Jubilee',
    artistId: 'artist-4',
    coverUrl: '',
    releaseYear: 2021,
    dominantColor: '#c44536',
  },
  {
    id: 'album-5',
    title: 'Mr. Morale & The Big Steppers',
    artistId: 'artist-5',
    coverUrl: '',
    releaseYear: 2022,
    dominantColor: '#5c4033',
  },
  {
    id: 'album-6',
    title: 'Charm',
    artistId: 'artist-6',
    coverUrl: '',
    releaseYear: 2024,
    dominantColor: '#6b3a5e',
  },
];

export const tracks: Track[] = [
  {
    id: 'track-1',
    title: 'Anti-Hero',
    artistId: 'artist-1',
    albumId: 'album-1',
    durationMs: 200000,
    popularity: 92,
  },
  {
    id: 'track-2',
    title: 'Kyoto',
    artistId: 'artist-2',
    albumId: 'album-2',
    durationMs: 214000,
    popularity: 78,
  },
  {
    id: 'track-3',
    title: 'Titi Me Pregunto',
    artistId: 'artist-3',
    albumId: 'album-3',
    durationMs: 243000,
    popularity: 88,
  },
  {
    id: 'track-4',
    title: 'Be Sweet',
    artistId: 'artist-4',
    albumId: 'album-4',
    durationMs: 211000,
    popularity: 71,
  },
  {
    id: 'track-5',
    title: 'N95',
    artistId: 'artist-5',
    albumId: 'album-5',
    durationMs: 195000,
    popularity: 85,
  },
  {
    id: 'track-6',
    title: 'Sexy to Someone',
    artistId: 'artist-6',
    albumId: 'album-6',
    durationMs: 189000,
    popularity: 74,
  },
  {
    id: 'track-7',
    title: 'Lavender Haze',
    artistId: 'artist-1',
    albumId: 'album-1',
    durationMs: 202000,
    popularity: 89,
  },
  {
    id: 'track-8',
    title: 'Garden Song',
    artistId: 'artist-2',
    albumId: 'album-2',
    durationMs: 252000,
    popularity: 72,
  },
  {
    id: 'track-9',
    title: 'United in Grief',
    artistId: 'artist-5',
    albumId: 'album-5',
    durationMs: 254000,
    popularity: 76,
  },
  {
    id: 'track-10',
    title: 'Paprika',
    artistId: 'artist-4',
    albumId: 'album-4',
    durationMs: 225000,
    popularity: 65,
  },
];

export function getArtist(id: string): Artist {
  return artists.find(a => a.id === id) ?? artists[0];
}

export function getAlbum(id: string): Album {
  return albums.find(a => a.id === id) ?? albums[0];
}

export function getTrack(id: string): Track {
  return tracks.find(t => t.id === id) ?? tracks[0];
}
