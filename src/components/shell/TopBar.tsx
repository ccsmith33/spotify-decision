import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import type { TabId } from '../../data/types';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  scrollOpacity: number;
  user: { displayName: string; avatarUrl: string | null; isPremium: boolean } | null;
  isAuthenticated: boolean;
  onLogin: () => Promise<void>;
  onLogout: () => void;
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'demo', label: 'Demo' },
  { id: 'presentation', label: 'Presentation' },
  { id: 'video', label: 'Video' },
  { id: 'appendix', label: 'Appendix' },
];

export function TopBar({
  activeTab,
  onTabChange,
  scrollOpacity,
  user,
  isAuthenticated,
  onLogin,
  onLogout,
}: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={styles.topBar}
      style={{ backgroundColor: `rgba(18, 18, 18, ${scrollOpacity})` }}
    >
      <div className={styles.navArrows}>
        <button className={styles.arrowButton} aria-label="Go back">
          <ChevronLeft size={16} />
        </button>
        <button className={styles.arrowButton} aria-label="Go forward">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className={styles.tabSwitcher}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.userArea}>
        {isAuthenticated && user ? (
          <div className={styles.userProfile} ref={dropdownRef}>
            <button
              className={styles.userButton}
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.displayName} className={styles.avatarImage} />
              ) : (
                <div className={styles.avatar}>
                  {user.displayName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className={styles.userName}>{user.displayName}</span>
            </button>
            {dropdownOpen && (
              <div className={styles.dropdown}>
                <button className={styles.dropdownItem} onClick={() => { onLogout(); setDropdownOpen(false); }}>
                  <LogOut size={16} />
                  Disconnect
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className={styles.connectButton} onClick={onLogin}>
            Connect Spotify
          </button>
        )}
      </div>
    </div>
  );
}
