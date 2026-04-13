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

/** Simple seeded PRNG so factor jitter is deterministic per track. */
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return (h % 1000) / 1000;        // 0..0.999
  };
}

function normalizeWeights(weights: number[]): number[] {
  const sum = weights.reduce((s, w) => s + w, 0);
  if (sum === 0) return weights.map(() => 1 / weights.length);
  return weights.map(w => Math.round((w / sum) * 100) / 100);
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
  const isTopArtist = !!matchedArtist;
  const popularity = spotifyTrack.popularity;
  const popularityTier =
    popularity >= 70 ? 'High' : popularity >= 40 ? 'Medium' : 'Niche';
  const hasGenres = artistGenres.length > 0;

  // --- Dynamic base weights ---
  let genreW = hasGenres ? 0.30 : 0.10;
  let artistW = isTopArtist ? 0.38 : 0.20;
  let listeningW = 0.20;
  let popularityW = 0.10 + (popularity / 100) * 0.10;   // 0.10 – 0.20
  let recencyW = 0.10;

  // Redistribute weight removed from Genre Match when no genres
  if (!hasGenres) {
    listeningW += 0.10;
    recencyW += 0.10;
  }

  // Add per-track jitter (+-0.03) so no two tracks are identical
  const rng = seededRandom(spotifyTrack.id);
  const jitter = () => (rng() - 0.5) * 0.06;          // -0.03..+0.03
  genreW      = Math.max(0.02, genreW + jitter());
  artistW     = Math.max(0.02, artistW + jitter());
  listeningW  = Math.max(0.02, listeningW + jitter());
  popularityW = Math.max(0.02, popularityW + jitter());
  recencyW    = Math.max(0.02, recencyW + jitter());

  const normalized = normalizeWeights([genreW, artistW, listeningW, popularityW, recencyW]);

  const factors = [
    { name: 'Genre Match', weight: normalized[0], description: hasGenres ? `Genres: ${artistGenres.slice(0, 3).join(', ')}` : 'Recommended based on your listening patterns' },
    { name: 'Artist Similarity', weight: normalized[1], description: isTopArtist ? 'One of your top artists' : 'Similar to artists you listen to' },
    { name: 'Listening Frequency', weight: normalized[2], description: 'Based on your recent listening patterns' },
    { name: 'Popularity', weight: normalized[3], description: `${popularityTier} popularity (${popularity}/100)` },
    { name: 'Recency', weight: normalized[4], description: 'In your recent heavy rotation' },
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
