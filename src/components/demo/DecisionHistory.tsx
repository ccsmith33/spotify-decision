import { useState } from 'react';
import type { AlgorithmDecision, Explanation, DetailLevel } from '../../data/types';
import { explanations as mockExplanations } from '../../data/decisions';
import styles from './DecisionHistory.module.css';

interface DecisionHistoryProps {
  decisions: AlgorithmDecision[];
  liveExplanations?: Explanation[];
  detailLevel: DetailLevel;
}

const typeLabels: Record<AlgorithmDecision['type'], string> = {
  playlist_curation: 'Playlist Curation',
  song_radio: 'Song Radio',
  discover_weekly: 'Discover Weekly',
  home_feed: 'Home Feed',
  search_ranking: 'Search Ranking',
};

export function DecisionHistory({ decisions, liveExplanations, detailLevel }: DecisionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sorted = [...decisions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className={styles.timeline}>
      {sorted.map(decision => {
        const isExpanded = expandedId === decision.id;
        const explanation = liveExplanations?.find(e => e.decisionId === decision.id)
          ?? mockExplanations.find(e => e.decisionId === decision.id);

        return (
          <div key={decision.id} className={styles.entry}>
            <div className={styles.dot} />
            <div
              className={styles.entryCard}
              onClick={() => setExpandedId(isExpanded ? null : decision.id)}
            >
              <div className={styles.entryHeader}>
                <span className={styles.timestamp}>
                  {new Date(decision.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </span>
                <span className={styles.badge}>{typeLabels[decision.type]}</span>
              </div>
              <p className={styles.entryDescription}>{decision.description}</p>
              {isExpanded && explanation && (
                <div className={styles.details}>
                  <p>{explanation[detailLevel]}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
