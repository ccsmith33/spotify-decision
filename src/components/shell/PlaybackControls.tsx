import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat } from 'lucide-react';
import styles from './PlaybackControls.module.css';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
}

export function PlaybackControls({ isPlaying, onPlayPause }: PlaybackControlsProps) {
  return (
    <div className={styles.controls}>
      <button className={styles.controlButton} aria-label="Shuffle">
        <Shuffle size={16} />
      </button>
      <button className={styles.controlButton} aria-label="Previous">
        <SkipBack size={16} fill="currentColor" />
      </button>
      <button className={styles.playButton} onClick={onPlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
      </button>
      <button className={styles.controlButton} aria-label="Next">
        <SkipForward size={16} fill="currentColor" />
      </button>
      <button className={styles.controlButton} aria-label="Repeat">
        <Repeat size={16} />
      </button>
    </div>
  );
}
