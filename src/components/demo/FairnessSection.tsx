import { Info, ArrowRight } from 'lucide-react';
import type { FairnessAudit } from '../../data/types';
import { FairnessMetricCard } from './FairnessMetricCard';
import styles from './FairnessSection.module.css';

interface FairnessSectionProps {
  audits: FairnessAudit[];
}

export function FairnessSection({ audits }: FairnessSectionProps) {
  const latestAudit = audits[0];

  const scrollToAppeal = () => {
    document.getElementById('appeal-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Fairness & Oversight</h2>

      <div className={styles.callout}>
        <div className={styles.calloutTitle}>
          <Info size={16} />
          Understanding These Metrics
        </div>
        <p className={styles.calloutText}>
          These metrics measure platform-wide fairness, not individual user guarantees.
          Think of it like a city's air quality index -- it measures the whole city, not
          your living room. A 12% independent artist exposure rate means that across all
          users and all algorithmic playlists, about 12 out of every 100 recommendation
          slots go to independent artists. Your personal experience may differ based on
          your taste profile and listening history.
        </p>
      </div>

      <div className={styles.auditInfo}>
        Last audited: {new Date(latestAudit.auditDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        {' '} by {latestAudit.auditor} | Overall score: {Math.round(latestAudit.overallScore * 100)}/100
      </div>

      <div className={styles.metricsGrid}>
        {latestAudit.metrics.map(metric => (
          <FairnessMetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <button className={styles.challengeLink} onClick={scrollToAppeal}>
        Think something is unfair? Challenge a decision
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
