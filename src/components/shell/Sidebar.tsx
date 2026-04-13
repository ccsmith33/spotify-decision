import { Home, Search, Library, Plus, List } from 'lucide-react';
import { playlists } from '../../data/playlists';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTab: string;
}

const playlistColors = ['#1DB954', '#4a2c6e', '#2d6b4f', '#c44536', '#e8115b', '#5c4033'];

export function Sidebar({ activeTab }: SidebarProps) {
  return (
    <div className={styles.sidebar}>
      <nav className={styles.navPanel}>
        <button className={`${styles.navItem} ${activeTab === 'demo' ? styles.navItemActive : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </button>
        <button className={styles.navItem}>
          <Search size={24} />
          <span>Search</span>
        </button>
      </nav>

      <div className={styles.libraryPanel}>
        <div className={styles.libraryHeader}>
          <button className={styles.libraryTitle}>
            <Library size={24} />
            <span>Your Library</span>
          </button>
          <div className={styles.headerIcons}>
            <button className={styles.iconButton} aria-label="Add">
              <Plus size={16} />
            </button>
            <button className={styles.iconButton} aria-label="Show list">
              <List size={16} />
            </button>
          </div>
        </div>

        <div className={styles.filterChips}>
          <button className={`${styles.chip} ${styles.chipActive}`}>Playlists</button>
          <button className={styles.chip}>Artists</button>
          <button className={styles.chip}>Albums</button>
        </div>

        <div className={styles.playlistList}>
          {playlists.map((playlist, index) => (
            <div key={playlist.id} className={styles.playlistItem}>
              <div
                className={styles.playlistCover}
                style={{ background: playlistColors[index % playlistColors.length] }}
              >
                {playlist.isAlgorithmic ? '~' : '\u266B'}
              </div>
              <div className={styles.playlistInfo}>
                <div className={styles.playlistName}>{playlist.name}</div>
                <div className={styles.playlistMeta}>
                  Playlist {playlist.isAlgorithmic ? '• Made for you' : `• ${playlist.trackIds.length} songs`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
