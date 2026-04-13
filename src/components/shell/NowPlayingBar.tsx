import { Heart, ListMusic, Monitor, Maximize2, Volume2 } from 'lucide-react';
import type { Track } from '../../data/types';
import { getArtist, getAlbum } from '../../data/tracks';
import { PlaybackControls } from './PlaybackControls';
import { ProgressBar } from './ProgressBar';
import styles from './NowPlayingBar.module.css';

interface NowPlayingBarProps {
  track: Track;
  isPlaying: boolean;
  progress: number;
  volume: number;
  onPlayPause: () => void;
  onProgressChange: (val: number) => void;
  onVolumeChange: (val: number) => void;
}

const albumColors = ['#1a1a5e', '#4a2c6e', '#2d6b4f', '#c44536', '#5c4033', '#6b3a5e'];

export function NowPlayingBar({
  track,
  isPlaying,
  progress,
  volume,
  onPlayPause,
  onProgressChange,
  onVolumeChange,
}: NowPlayingBarProps) {
  const artist = getArtist(track.artistId);
  const album = getAlbum(track.albumId);
  const currentTime = (progress / 100) * (track.durationMs / 1000);
  const duration = track.durationMs / 1000;
  const colorIndex = parseInt(album.id.replace('album-', ''), 10) - 1;

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        <div
          className={styles.albumArt}
          style={{ background: albumColors[colorIndex % albumColors.length] }}
          aria-label={`${album.title} cover`}
        >
          {'\u266B'}
        </div>
        <div className={styles.trackInfo}>
          <div className={styles.trackTitle}>{track.title}</div>
          <div className={styles.trackArtist}>{artist.name}</div>
        </div>
        <button className={styles.utilityButton} aria-label="Like">
          <Heart size={16} />
        </button>
      </div>

      <div className={styles.center}>
        <PlaybackControls isPlaying={isPlaying} onPlayPause={onPlayPause} />
        <div className={styles.progressWrapper}>
          <ProgressBar
            value={progress}
            onChange={onProgressChange}
            showTime
            currentTime={currentTime}
            duration={duration}
          />
        </div>
      </div>

      <div className={styles.right}>
        <button className={styles.utilityButton} aria-label="Queue">
          <ListMusic size={16} />
        </button>
        <button className={styles.utilityButton} aria-label="Devices">
          <Monitor size={16} />
        </button>
        <button className={styles.utilityButton} aria-label="Volume">
          <Volume2 size={16} />
        </button>
        <div className={styles.volumeWrapper}>
          <ProgressBar value={volume} onChange={onVolumeChange} />
        </div>
        <button className={styles.utilityButton} aria-label="Full screen">
          <Maximize2 size={16} />
        </button>
      </div>
    </div>
  );
}
