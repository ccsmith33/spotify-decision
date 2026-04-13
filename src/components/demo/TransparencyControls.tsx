import type { DetailLevel } from '../../data/types';
import styles from './TransparencyControls.module.css';

interface TransparencyControlsProps {
  detailLevel: DetailLevel;
  onDetailLevelChange: (level: DetailLevel) => void;
  notificationsEnabled: boolean;
  onNotificationsToggle: () => void;
}

const levels: { id: DetailLevel; label: string; description: string }[] = [
  { id: 'basic', label: 'Basic', description: 'Just the essentials -- simple, plain-language explanations.' },
  { id: 'detailed', label: 'Detailed', description: 'Show me more -- additional context and methodology.' },
  { id: 'technical', label: 'Technical', description: 'Full transparency -- complete technical details.' },
];

export function TransparencyControls({
  detailLevel,
  onDetailLevelChange,
  notificationsEnabled,
  onNotificationsToggle,
}: TransparencyControlsProps) {
  const currentLevel = levels.find(l => l.id === detailLevel);

  return (
    <div className={styles.card}>
      <div className={styles.section}>
        <div className={styles.label}>Explanation Detail Level</div>
        <div className={styles.options}>
          {levels.map(level => (
            <button
              key={level.id}
              className={`${styles.option} ${detailLevel === level.id ? styles.optionActive : ''}`}
              onClick={() => onDetailLevelChange(level.id)}
            >
              {level.label}
            </button>
          ))}
        </div>
        {currentLevel && (
          <div className={styles.optionDescription}>{currentLevel.description}</div>
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.toggleRow}>
          <div>
            <div className={styles.label} style={{ marginBottom: 0 }}>Fairness Report Notifications</div>
            <div className={styles.optionDescription}>
              Receive updates when new fairness audit reports are published.
            </div>
          </div>
          <button
            className={`${styles.toggleSwitch} ${notificationsEnabled ? styles.toggleSwitchActive : ''}`}
            onClick={onNotificationsToggle}
            aria-label="Toggle notifications"
          >
            <div className={styles.toggleKnob} />
          </button>
        </div>
      </div>
    </div>
  );
}
