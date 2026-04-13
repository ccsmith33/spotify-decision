import { useState, useMemo } from 'react';
import { Home, Search, Library, Plus, List, Info } from 'lucide-react';
import { playlists as mockPlaylists } from '../../data/playlists';
import { useSpotify } from '../../context/SpotifyContext';
import styles from './Sidebar.module.css';

interface SidebarProps {
  activeTab: string;
  onSelectPlaylist?: (playlist: { id: string; name: string; imageUrl: string | null; description: string }) => void;
}

const playlistColors = ['#1DB954', '#4a2c6e', '#2d6b4f', '#c44536', '#e8115b', '#5c4033'];

const ALGORITHMIC_NAMES = [
  'discover weekly',
  'daily mix',
  'release radar',
  'on repeat',
  'repeat rewind',
  'time capsule',
  'your top songs',
  'daylist',
];

function isAlgorithmicPlaylist(name: string, ownerId: string): boolean {
  if (ownerId === 'spotify') return true;
  const lower = name.toLowerCase();
  return ALGORITHMIC_NAMES.some(pattern => lower.includes(pattern));
}

function getAlgorithmicExplanation(
  name: string,
  topGenres: string[],
  topArtistNames: string[],
): string {
  const lower = name.toLowerCase();
  const genreList = topGenres.slice(0, 3).join(', ') || 'your favorite genres';
  const artistList = topArtistNames.slice(0, 3).join(', ') || 'your top artists';

  if (lower.includes('discover weekly')) {
    return `This week's mix is shaped by your recent listening to ${genreList}. Artists like ${artistList} influenced these picks.`;
  }
  if (lower.includes('daily mix')) {
    const clusterGenre = topGenres[0] ?? 'your most-played genres';
    return `This mix focuses on ${clusterGenre} based on your most-played artists in this category.`;
  }
  if (lower.includes('release radar')) {
    return `New releases from artists you follow and artists similar to ${artistList}.`;
  }
  if (lower.includes('on repeat')) {
    return `Tracks you've had on heavy rotation recently. ${artistList} features prominently in your repeat plays.`;
  }
  if (lower.includes('repeat rewind')) {
    return `Past favorites you used to have on repeat. Built from your long-term listening history.`;
  }
  if (lower.includes('time capsule')) {
    return `A nostalgia playlist based on music from your formative listening years.`;
  }
  if (lower.includes('daylist')) {
    return `Updates throughout the day to match your mood. Right now it draws from ${genreList}.`;
  }
  // Generic algorithmic playlist
  return `Made for you based on your taste in ${genreList} and artists like ${artistList}.`;
}

export function Sidebar({ activeTab, onSelectPlaylist }: SidebarProps) {
  const { isAuthenticated, playlists: livePlaylists, topArtists } = useSpotify();
  const [tooltipId, setTooltipId] = useState<string | null>(null);

  const { topGenres, topArtistNames } = useMemo(() => {
    const genreCounts: Record<string, number> = {};
    for (const artist of topArtists) {
      for (const genre of (artist.genres ?? [])) {
        genreCounts[genre] = (genreCounts[genre] ?? 0) + 1;
      }
    }
    const sorted = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([g]) => g);
    return {
      topGenres: sorted.slice(0, 5),
      topArtistNames: topArtists.slice(0, 5).map(a => a.name),
    };
  }, [topArtists]);

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
          {isAuthenticated && livePlaylists.length > 0
            ? livePlaylists.map((playlist, index) => {
                const algorithmic = isAlgorithmicPlaylist(playlist.name, playlist.ownerId);
                const showTooltip = tooltipId === playlist.id;
                return (
                  <div
                    key={playlist.id}
                    className={styles.playlistItem}
                    onClick={() => {
                      if (onSelectPlaylist) {
                        const explanation = algorithmic
                          ? getAlgorithmicExplanation(playlist.name, topGenres, topArtistNames)
                          : '';
                        onSelectPlaylist({
                          id: playlist.id,
                          name: playlist.name,
                          imageUrl: playlist.imageUrl,
                          description: explanation,
                        });
                      }
                    }}
                  >
                    {playlist.imageUrl ? (
                      <img
                        src={playlist.imageUrl}
                        alt={playlist.name}
                        className={styles.playlistCoverImage}
                      />
                    ) : (
                      <div
                        className={styles.playlistCover}
                        style={{ background: playlistColors[index % playlistColors.length] }}
                      >
                        {'\u266B'}
                      </div>
                    )}
                    <div className={styles.playlistInfo}>
                      <div className={styles.playlistNameRow}>
                        <div className={styles.playlistName}>{playlist.name}</div>
                        {algorithmic && (
                          <div className={styles.infoIconWrapper}>
                            <button
                              className={styles.infoIcon}
                              aria-label={`Transparency info for ${playlist.name}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setTooltipId(showTooltip ? null : playlist.id);
                              }}
                              onMouseEnter={() => setTooltipId(playlist.id)}
                              onMouseLeave={() => setTooltipId(null)}
                            >
                              <Info size={12} />
                            </button>
                            {showTooltip && (
                              <div className={styles.tooltip}>
                                <div className={styles.tooltipHeader}>Algorithm Transparency</div>
                                <p className={styles.tooltipText}>
                                  {getAlgorithmicExplanation(playlist.name, topGenres, topArtistNames)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className={styles.playlistMeta}>
                        {algorithmic ? 'Made for you' : `Playlist${playlist.owner ? ` • ${playlist.owner}` : ''}`}
                        {playlist.trackCount > 0 ? ` • ${playlist.trackCount} songs` : ''}
                      </div>
                    </div>
                  </div>
                );
              })
            : mockPlaylists.map((playlist, index) => (
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
