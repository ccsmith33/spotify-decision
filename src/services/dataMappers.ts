import type { Track, Artist, Album, Recommendation } from '../data/types';
import type { SpotifyTrack, SpotifyArtist } from './spotifyTypes';

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
    genres: sa.genres ?? [],
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
  claudeExplanation: { basic: string; detailed: string; technical: string },
): Recommendation {
  const track = mapSpotifyTrack(spotifyTrack);
  const artistId = spotifyTrack.artists[0]?.id ?? '';
  const matchedArtist = spotifyArtists.get(artistId);
  const artist = matchedArtist
    ? mapSpotifyArtist(matchedArtist)
    : {
        id: artistId,
        name: spotifyTrack.artists[0]?.name ?? '',
        imageUrl: '',
        isIndependent: false,
        genres: [],
        monthlyListeners: 0,
      };
  const album = mapSpotifyAlbum(spotifyTrack);

  const artistGenres = matchedArtist?.genres ?? [];
  const popularityTier =
    spotifyTrack.popularity >= 70 ? 'High' : spotifyTrack.popularity >= 40 ? 'Medium' : 'Niche';

  const factors = [
    { name: 'Genre Match', weight: 0.30, description: artistGenres.length > 0 ? `Genres: ${artistGenres.slice(0, 3).join(', ')}` : 'Recommended based on your listening patterns' },
    { name: 'Artist Similarity', weight: 0.25, description: matchedArtist ? 'One of your top artists' : 'Similar to artists you listen to' },
    { name: 'Listening Frequency', weight: 0.20, description: 'Based on your recent listening patterns' },
    { name: 'Popularity', weight: 0.15, description: `${popularityTier} popularity (${spotifyTrack.popularity}/100)` },
    { name: 'Recency', weight: 0.10, description: 'In your recent heavy rotation' },
  ];

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
      basic: claudeExplanation.basic,
      detailed: claudeExplanation.detailed,
      technical: claudeExplanation.technical,
      disclosureBoundary:
        'Exact collaborative filtering weights and neural network internals are proprietary.',
      generatedAt: new Date().toISOString(),
    },
    topFactor: claudeExplanation.basic || factors[0].description,
  };
}
