import type { AlgorithmFactor } from '../../data/types';
import styles from './FactorBreakdown.module.css';

interface FactorBreakdownProps {
  factors: AlgorithmFactor[];
}

const factorColors = ['#1DB954', '#1e90ff', '#e8115b', '#ffa42b', '#b3b3b3'];

export function FactorBreakdown({ factors }: FactorBreakdownProps) {
  const maxWeight = Math.max(...factors.map(f => f.weight));

  return (
    <div className={styles.breakdown}>
      <div className={styles.barContainer}>
        {factors.map((factor, i) => (
          <div
            key={factor.name}
            className={styles.segment}
            style={{
              width: `${factor.weight * 100}%`,
              backgroundColor: i === factors.indexOf(factors.find(f => f.weight === maxWeight)!)
                ? factorColors[0]
                : factorColors[i % factorColors.length],
            }}
            title={factor.description}
          >
            {factor.weight >= 0.15 && `${Math.round(factor.weight * 100)}%`}
          </div>
        ))}
      </div>
      <div className={styles.legend}>
        {factors.map((factor, i) => (
          <div key={factor.name} className={styles.legendItem}>
            <div
              className={styles.legendDot}
              style={{
                backgroundColor: i === factors.indexOf(factors.find(f => f.weight === maxWeight)!)
                  ? factorColors[0]
                  : factorColors[i % factorColors.length],
              }}
            />
            <span className={styles.legendName}>{factor.name}</span>
            <span className={styles.legendWeight}>{Math.round(factor.weight * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
