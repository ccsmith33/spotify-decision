import type { Recommendation } from './types';
import { tracks, artists, albums, getArtist, getAlbum } from './tracks';
import { decisions, explanations } from './decisions';

function buildRecommendation(
  trackIndex: number,
  decisionIndex: number,
  topFactor: string,
): Recommendation {
  const track = tracks[trackIndex];
  return {
    track,
    artist: getArtist(track.artistId),
    album: getAlbum(track.albumId),
    decision: decisions[decisionIndex],
    explanation: explanations[decisionIndex],
    topFactor,
  };
}

export const recommendations: Recommendation[] = [
  buildRecommendation(0, 1, 'Matches your pop listening history'),
  buildRecommendation(1, 0, 'Similar listeners also enjoy this'),
  buildRecommendation(2, 7, 'Trending in genres you explore'),
  buildRecommendation(3, 2, 'Audio features match your taste'),
  buildRecommendation(4, 3, 'Popular among your taste group'),
  buildRecommendation(5, 5, 'New release from your favorites'),
  buildRecommendation(6, 1, 'Sounds like tracks you love'),
  buildRecommendation(7, 0, 'Deep cut from a similar artist'),
  buildRecommendation(8, 7, 'Expanding your hip hop horizons'),
  buildRecommendation(9, 2, 'Discovery pick based on audio match'),
];

export { tracks, artists, albums };
