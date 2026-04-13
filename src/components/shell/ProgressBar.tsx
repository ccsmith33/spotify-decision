import { useCallback, useRef } from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  value: number;
  onChange: (val: number) => void;
  showTime?: boolean;
  currentTime?: number;
  duration?: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function ProgressBar({ value, onChange, showTime, currentTime, duration }: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    onChange(pct);
  }, [onChange]);

  const clampedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={styles.container}>
      {showTime && <span className={styles.time}>{formatTime(currentTime ?? 0)}</span>}
      <div className={styles.trackWrapper} ref={trackRef} onClick={handleClick}>
        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${clampedValue}%` }} />
        </div>
        <div className={styles.knob} style={{ left: `${clampedValue}%` }} />
      </div>
      {showTime && <span className={styles.time}>{formatTime(duration ?? 0)}</span>}
    </div>
  );
}
