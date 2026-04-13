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

export function DecisionCard({ decision, explanation, detailLevel }: DecisionCardProps) {
  const Icon = typeIcons[decision.type];
  const explanationText = explanation[detailLevel];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.icon}>
          <Icon size={20} />
        </div>
        <span className={styles.cardType}>{typeLabels[decision.type]}</span>
      </div>

      <h3 className={styles.cardTitle}>{decision.description}</h3>

      <p className={styles.explanation}>{explanationText}</p>

      <FactorBreakdown factors={decision.factors} />

      <div className={styles.boundary}>{explanation.disclosureBoundary}</div>

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
