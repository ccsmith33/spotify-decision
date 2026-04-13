import { ArrowLeft } from 'lucide-react';
import type { DetailLevel, Recommendation } from '../../data/types';
import { RecommendationList } from './RecommendationList';
import styles from './PlaylistDetailView.module.css';

interface PlaylistDetailViewProps {
  playlist: {
    id: string;
    name: string;
    imageUrl: string | null;
    description: string;
  };
  tracks: Recommendation[];
  isLoading: boolean;
  detailLevel: DetailLevel;
  transparencyExplanation?: string;
  onBack: () => void;
}

export function PlaylistDetailView({
  playlist,
  tracks,
  isLoading,
  detailLevel,
  transparencyExplanation,
  onBack,
}: PlaylistDetailViewProps) {
  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={16} />
        Back to Demo
      </button>

      <div className={styles.header}>
        {playlist.imageUrl ? (
          <img
            src={playlist.imageUrl}
            alt={playlist.name}
            className={styles.headerImage}
          />
        ) : (
          <div className={styles.headerImagePlaceholder}>{'\u266B'}</div>
        )}
        <div className={styles.headerInfo}>
          <span className={styles.headerTag}>Playlist</span>
          <h1 className={styles.headerTitle}>{playlist.name}</h1>
          {playlist.description && (
            <p className={styles.headerDescription}>{playlist.description}</p>
          )}
          <span className={styles.headerMeta}>{tracks.length} tracks</span>
        </div>
      </div>

      {transparencyExplanation && (
        <div className={styles.transparencyCard}>
          <div className={styles.transparencyLabel}>Algorithm Transparency</div>
          <p className={styles.transparencyText}>{transparencyExplanation}</p>
        </div>
      )}

      {isLoading ? (
        <div className={styles.loading}>
          <div className={styles.skeletonContainer}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={styles.skeletonRow}>
                <div className={styles.skeletonArt} />
                <div className={styles.skeletonText}>
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLineShort} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : tracks.length > 0 ? (
        <RecommendationList recommendations={tracks} detailLevel={detailLevel} />
      ) : (
        <div className={styles.empty}>No tracks found in this playlist.</div>
      )}
    </div>
  );
}
