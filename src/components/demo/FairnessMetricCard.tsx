import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { FairnessMetric } from '../../data/types';
import styles from './FairnessMetricCard.module.css';

interface FairnessMetricCardProps {
  metric: FairnessMetric;
}

export function FairnessMetricCard({ metric }: FairnessMetricCardProps) {
  const meetsTarget = metric.currentValue >= metric.targetValue;
  const maxVal = Math.max(metric.currentValue, metric.targetValue) * 1.2;
  const fillPct = (metric.currentValue / maxVal) * 100;
  const targetPct = (metric.targetValue / maxVal) * 100;

  const trendIcon = {
    up: <TrendingUp size={14} />,
    down: <TrendingDown size={14} />,
    stable: <Minus size={14} />,
  };

  const trendClass = {
    up: styles.trendUp,
    down: styles.trendDown,
    stable: styles.trendStable,
  };

  const diff = metric.currentValue - metric.previousValue;
  const diffStr = diff >= 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.name}>{metric.name}</div>
        <div className={`${styles.trend} ${trendClass[metric.trend]}`}>
          {trendIcon[metric.trend]}
          <span>{diffStr}{metric.unit === '%' ? 'pp' : ''} from last month</span>
        </div>
      </div>

      <div className={styles.values}>
        <span className={styles.currentValue}>
          {metric.currentValue}{metric.unit === '%' ? '%' : ''}
        </span>
        {metric.unit !== '%' && <span className={styles.unit}>{metric.unit}</span>}
        <span className={styles.targetLabel}>Target: {metric.targetValue}{metric.unit === '%' ? '%' : ` ${metric.unit}`}</span>
      </div>

      <div className={styles.barWrapper}>
        <div
          className={`${styles.barFill} ${meetsTarget ? styles.barFillGreen : styles.barFillWarning}`}
          style={{ width: `${Math.min(fillPct, 100)}%` }}
        />
        <div className={styles.targetMarker} style={{ left: `${Math.min(targetPct, 100)}%` }} />
      </div>

      <div className={styles.description}>{metric.description}</div>

      <div className={styles.lastUpdated}>
        Last updated: {new Date(metric.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
}
