import { useState } from 'react';
import { ListMusic, Radio, Disc3 } from 'lucide-react';
import type { AlgorithmDecision, Explanation, DetailLevel } from '../../data/types';
import { FactorBreakdown } from './FactorBreakdown';
import styles from './DecisionCard.module.css';

interface DecisionCardProps {
  decision: AlgorithmDecision;
  explanation: Explanation;
  detailLevel: DetailLevel;
}

const typeIcons: Record<AlgorithmDecision['type'], typeof ListMusic> = {
  playlist_curation: ListMusic,
  song_radio: Radio,
  discover_weekly: Disc3,
  home_feed: ListMusic,
  search_ranking: ListMusic,
};

const typeLabels: Record<AlgorithmDecision['type'], string> = {
  playlist_curation: 'Playlist Curation',
  song_radio: 'Song Radio',
  discover_weekly: 'Discover Weekly',
  home_feed: 'Home Feed',
  search_ranking: 'Search Ranking',
};

const typeColors: Record<AlgorithmDecision['type'], string> = {
  playlist_curation: '#1DB954',
  song_radio: '#1e90ff',
  discover_weekly: '#e8115b',
  home_feed: '#ffa42b',
  search_ranking: '#b3b3b3',
};

export function DecisionCard({ decision, explanation, detailLevel }: DecisionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const Icon = typeIcons[decision.type];
  const accentColor = typeColors[decision.type];
  const explanationText = explanation[detailLevel];

  return (
    <div className={styles.card} style={{ borderLeftColor: accentColor }}>
      <div className={styles.cardHeader}>
        <div className={styles.icon}>
          <Icon size={20} />
        </div>
        <span className={styles.cardType}>{typeLabels[decision.type]}</span>
      </div>

      <h3 className={styles.cardTitle}>{decision.description}</h3>

      <p className={expanded ? styles.explanation : styles.explanationClamped}>
        {explanationText}
      </p>
      <button
        type="button"
        className={styles.showMore}
        onClick={() => setExpanded(prev => !prev)}
      >
        {expanded ? 'Show less' : 'See details'}
      </button>

      <FactorBreakdown factors={decision.factors} />

      {expanded && (
        <div className={styles.boundary}>{explanation.disclosureBoundary}</div>
      )}

      <div className={styles.confidence}>
        <span>Confidence</span>
        <div className={styles.confidenceBar}>
          <div className={styles.confidenceFill} style={{ width: `${decision.confidence * 100}%` }} />
        </div>
        <span>{Math.round(decision.confidence * 100)}%</span>
      </div>
    </div>
  );
}
