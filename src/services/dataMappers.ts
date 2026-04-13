import type { Track, Artist, Album, Recommendation, AlgorithmFactor } from '../data/types';
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
  // Guard against NaN, Infinity, and negative values
  const safe = weights.map(w => (Number.isFinite(w) && w > 0) ? w : 0.02);
  const sum = safe.reduce((s, w) => s + w, 0);
  if (sum === 0) return safe.map(() => 1 / safe.length);
  return safe.map(w => {
    const normalized = Math.round((w / sum) * 100) / 100;
    return Number.isFinite(normalized) ? normalized : 1 / safe.length;
  });
}

export interface ClaudeFactorInput {
  name: string;
  weight: number;
}

export function buildLiveRecommendation(
  spotifyTrack: SpotifyTrack,
  spotifyArtists: Map<string, SpotifyArtist>,
  claudeExplanation: { basic: string; detailed: string; technical: string },
  claudeFactors?: ClaudeFactorInput[],
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

  let factors: AlgorithmFactor[];

  if (claudeFactors && claudeFactors.length > 0) {
    // Use Claude-provided factors — normalize to ensure they sum to 1.0
    const rawWeights = claudeFactors.map(f => (Number.isFinite(f.weight) && f.weight > 0) ? f.weight : 0.1);
    const normalized = normalizeWeights(rawWeights);
    factors = claudeFactors.map((f, i) => ({
      name: f.name,
      weight: normalized[i],
      description: f.name,
    }));
  } else {
    // Fallback: generate factors from track data
    const artistGenres = matchedArtist?.genres ?? [];
    const isTopArtist = !!matchedArtist;
    const popularity = spotifyTrack.popularity;
    const popularityTier =
      popularity >= 70 ? 'High' : popularity >= 40 ? 'Medium' : 'Niche';
    const hasGenres = artistGenres.length > 0;

    let genreW = hasGenres ? 0.30 : 0.10;
    let artistW = isTopArtist ? 0.38 : 0.20;
    let listeningW = 0.20;
    let popularityW = 0.10 + (popularity / 100) * 0.10;
    let recencyW = 0.10;

    if (!hasGenres) {
      listeningW += 0.10;
      recencyW += 0.10;
    }

    const rng = seededRandom(spotifyTrack.id);
    const jitter = () => (rng() - 0.5) * 0.06;
    genreW      = Math.max(0.02, genreW + jitter());
    artistW     = Math.max(0.02, artistW + jitter());
    listeningW  = Math.max(0.02, listeningW + jitter());
    popularityW = Math.max(0.02, popularityW + jitter());
    recencyW    = Math.max(0.02, recencyW + jitter());

    const normalized = normalizeWeights([genreW, artistW, listeningW, popularityW, recencyW]);

    factors = [
      { name: 'Genre Match', weight: normalized[0], description: hasGenres ? `Genres: ${artistGenres.slice(0, 3).join(', ')}` : 'Recommended based on your listening patterns' },
      { name: 'Artist Similarity', weight: normalized[1], description: isTopArtist ? 'One of your top artists' : 'Similar to artists you listen to' },
      { name: 'Listening Frequency', weight: normalized[2], description: 'Based on your recent listening patterns' },
      { name: 'Popularity', weight: normalized[3], description: `${popularityTier} popularity (${popularity}/100)` },
      { name: 'Recency', weight: normalized[4], description: 'In your recent heavy rotation' },
    ];
  }

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
