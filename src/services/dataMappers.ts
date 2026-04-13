import type { Track, Artist, Album, Recommendation } from '../data/types';
import type { SpotifyTrack, SpotifyArtist, SpotifyAudioFeature } from './spotifyTypes';

export function mapSpotifyTrack(st: SpotifyTrack): Track {
  return {
    id: st.id,
    title: st.name,
    artistId: st.artists[0]?.id ?? '',
    albumId: st.album.id,
    durationMs: st.duration_ms,
    popularity: st.popularity,
  };
}

export function mapSpotifyArtist(sa: SpotifyArtist): Artist {
  return {
    id: sa.id,
    name: sa.name,
    imageUrl: sa.images[0]?.url ?? '',
    isIndependent: false,
    genres: sa.genres,
    monthlyListeners: 0,
  };
}

export function mapSpotifyAlbum(st: SpotifyTrack): Album {
  return {
    id: st.album.id,
    title: st.album.name,
    artistId: st.artists[0]?.id ?? '',
    coverUrl: st.album.images[0]?.url ?? '',
    releaseYear: 0,
    dominantColor: '#1a1a5e',
  };
}

export function buildLiveRecommendation(
  spotifyTrack: SpotifyTrack,
  spotifyArtists: Map<string, SpotifyArtist>,
  audioFeature: SpotifyAudioFeature | undefined,
  claudeExplanation: string,
): Recommendation {
  const track = mapSpotifyTrack(spotifyTrack);
  const artistId = spotifyTrack.artists[0]?.id ?? '';
  const artist = spotifyArtists.has(artistId)
    ? mapSpotifyArtist(spotifyArtists.get(artistId)!)
    : {
        id: artistId,
        name: spotifyTrack.artists[0]?.name ?? '',
        imageUrl: '',
        isIndependent: false,
        genres: [],
        monthlyListeners: 0,
      };
  const album = mapSpotifyAlbum(spotifyTrack);

  const factors = audioFeature
    ? [
        { name: 'Listening History', weight: 0.35, description: 'Based on your past listening patterns' },
        {
          name: 'Audio Features',
          weight: 0.25,
          description: `Energy ${(audioFeature.energy * 100).toFixed(0)}%, Danceability ${(audioFeature.danceability * 100).toFixed(0)}%`,
        },
        { name: 'Collaborative Filtering', weight: 0.20, description: 'Similar listeners also enjoy this' },
        { name: 'Genre Match', weight: 0.15, description: 'Matches genres in your library' },
        { name: 'Recency', weight: 0.05, description: 'Release timing and trending factor' },
      ]
    : [];

  const topFactor = factors.length > 0 ? factors[0].description : 'Recommended for you';

  return {
    track,
    artist,
    album,
    decision: {
      id: `live-decision-${spotifyTrack.id}`,
      type: 'discover_weekly',
      timestamp: new Date().toISOString(),
      description: `Recommended "${spotifyTrack.name}" based on your listening profile`,
      factors,
      confidence: 0.85,
      trackIds: [spotifyTrack.id],
      explanationId: `live-explanation-${spotifyTrack.id}`,
    },
    explanation: {
      id: `live-explanation-${spotifyTrack.id}`,
      decisionId: `live-decision-${spotifyTrack.id}`,
      basic: claudeExplanation,
      detailed: claudeExplanation,
      technical: claudeExplanation,
      disclosureBoundary:
        'Exact collaborative filtering weights and neural network internals are proprietary.',
      generatedAt: new Date().toISOString(),
    },
    topFactor,
  };
}
