import { useState } from 'react';
import type { Recommendation, DetailLevel } from '../../data/types';
import { FactorBreakdown } from './FactorBreakdown';
import styles from './RecommendationList.module.css';

interface RecommendationListProps {
  recommendations: Recommendation[];
  detailLevel: DetailLevel;
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const albumColors: Record<string, string> = {
  'album-1': '#1a1a5e',
  'album-2': '#4a2c6e',
  'album-3': '#2d6b4f',
  'album-4': '#c44536',
  'album-5': '#5c4033',
  'album-6': '#6b3a5e',
};

export function RecommendationList({ recommendations, detailLevel }: RecommendationListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className={styles.table}>
      <div className={styles.headerRow}>
        <span className={styles.headerCellRight}>#</span>
        <span className={styles.headerCell}>Title</span>
        <span className={styles.headerCell}>Album</span>
        <span className={styles.headerCell}>Why</span>
        <span className={styles.headerCellRight}>Duration</span>
      </div>

      {recommendations.map((rec, index) => {
        const isExpanded = expandedId === rec.track.id;
        const hasRealArt = rec.album.coverUrl && rec.album.coverUrl.length > 0;
        return (
          <div key={rec.track.id}>
            <div
              className={styles.row}
              onClick={() => setExpandedId(isExpanded ? null : rec.track.id)}
            >
              <span className={styles.rowIndex}>{index + 1}</span>
              <div className={styles.trackCell}>
                {hasRealArt ? (
                  <img
                    src={rec.album.coverUrl}
                    alt={rec.album.title}
                    className={styles.trackArtImage}
                  />
                ) : (
                  <div
                    className={styles.trackArt}
                    style={{ background: albumColors[rec.album.id] ?? '#282828' }}
                  >
                    {'\u266B'}
                  </div>
                )}
                <div className={styles.trackDetails}>
                  <div className={styles.trackName}>{rec.track.title}</div>
                  <div className={styles.trackArtistName}>{rec.artist.name}</div>
                </div>
              </div>
              <span className={styles.albumCell}>{rec.album.title}</span>
              <span className={styles.whyCell}>
                {rec.explanation.basic && rec.explanation.basic !== 'Recommended based on your listening patterns.'
                  ? rec.explanation.basic
                  : rec.topFactor}
              </span>
              <span className={styles.durationCell}>{formatDuration(rec.track.durationMs)}</span>
            </div>
            {isExpanded && (
              <div className={styles.expandedRow}>
                <p className={styles.expandedExplanation}>{rec.explanation[detailLevel]}</p>
                <FactorBreakdown factors={rec.decision.factors} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
