import { Film } from 'lucide-react';
import styles from './VideoPage.module.css';

const VIDEO_SRC: string | null = null;

export function VideoPage() {
  if (!VIDEO_SRC) {
    return (
      <div className={styles.page}>
        <div className={styles.placeholder}>
          <Film size={48} className={styles.icon} />
          <h2 className={styles.placeholderTitle}>Presentation Recording</h2>
          <p className={styles.placeholderSubtitle}>
            Video will be available after the live presentation. Check back after the in-class demo
            for the full recording.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.playerWrapper}>
        <video className={styles.video} controls src={VIDEO_SRC}>
          Your browser does not support the video element.
        </video>
      </div>
    </div>
  );
}
