import { Heart, ListMusic, Monitor, Maximize2, Volume2, SkipBack, SkipForward } from 'lucide-react';
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
  albumImageUrl?: string | null;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onProgressChange: (val: number) => void;
  onVolumeChange: (val: number) => void;
}

const albumColors = ['#1a1a5e', '#4a2c6e', '#2d6b4f', '#c44536', '#5c4033', '#6b3a5e'];

export function NowPlayingBar({
  track,
  isPlaying,
  progress,
  volume,
  albumImageUrl,
  onPlayPause,
  onNext,
  onPrevious,
  onProgressChange,
  onVolumeChange,
}: NowPlayingBarProps) {
  // For live Spotify tracks the artistId/albumId won't match mock data lookups,
  // but we still attempt it for mock mode and fall back gracefully
  const isMockTrack = track.id.startsWith('track-');
  const artist = isMockTrack ? getArtist(track.artistId) : null;
  const album = isMockTrack ? getAlbum(track.albumId) : null;
  const currentTime = (progress / 100) * (track.durationMs / 1000);
  const duration = track.durationMs / 1000;

  const colorIndex = album
    ? parseInt(album.id.replace('album-', ''), 10) - 1
    : 0;

  const artistName = artist?.name ?? track.artistId;
  const trackTitle = track.title;

  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        {albumImageUrl ? (
          <img src={albumImageUrl} alt="Album art" className={styles.albumArtImage} />
        ) : (
          <div
            className={styles.albumArt}
            style={{ background: albumColors[colorIndex % albumColors.length] }}
            aria-label={album ? `${album.title} cover` : 'Album cover'}
          >
            {'\u266B'}
          </div>
        )}
        <div className={styles.trackInfo}>
          <div className={styles.trackTitle}>{trackTitle}</div>
          <div className={styles.trackArtist}>{artistName}</div>
        </div>
        <button className={styles.utilityButton} aria-label="Like">
          <Heart size={16} />
        </button>
      </div>

      <div className={styles.center}>
        <div className={styles.controlsRow}>
          {onPrevious && (
            <button className={styles.utilityButton} onClick={onPrevious} aria-label="Previous">
              <SkipBack size={16} />
            </button>
          )}
          <PlaybackControls isPlaying={isPlaying} onPlayPause={onPlayPause} />
          {onNext && (
            <button className={styles.utilityButton} onClick={onNext} aria-label="Next">
              <SkipForward size={16} />
            </button>
          )}
        </div>
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
