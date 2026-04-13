import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { TabId } from '../../data/types';
import styles from './TopBar.module.css';

interface TopBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  scrollOpacity: number;
}

const tabs: { id: TabId; label: string }[] = [
  { id: 'demo', label: 'Demo' },
  { id: 'presentation', label: 'Presentation' },
  { id: 'video', label: 'Video' },
  { id: 'appendix', label: 'Appendix' },
];

export function TopBar({ activeTab, onTabChange, scrollOpacity }: TopBarProps) {
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
        <div className={styles.avatar}>CS</div>
      </div>
    </div>
  );
}
