import { useState, useRef } from 'react';
import type { TabId, DetailLevel } from './data/types';
import { usePlaybackSimulation } from './hooks/usePlaybackSimulation';
import { useScrollOpacity } from './hooks/useScrollOpacity';
import { Sidebar } from './components/shell/Sidebar';
import { TopBar } from './components/shell/TopBar';
import { NowPlayingBar } from './components/shell/NowPlayingBar';
import { DemoPage } from './components/demo/DemoPage';
import { PresentationPage } from './components/presentation/PresentationPage';
import { VideoPage } from './components/video/VideoPage';
import { AppendixPage } from './components/appendix/AppendixPage';
import styles from './App.module.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('demo');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('basic');
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollOpacity = useScrollOpacity(contentRef);
  const playback = usePlaybackSimulation();

  const renderContent = () => {
    switch (activeTab) {
      case 'demo':
        return <DemoPage detailLevel={detailLevel} onDetailLevelChange={setDetailLevel} />;
      case 'presentation':
        return <PresentationPage />;
      case 'video':
        return <VideoPage />;
      case 'appendix':
        return <AppendixPage />;
    }
  };

  return (
    <div className={styles.app}>
      <Sidebar activeTab={activeTab} />
      <div className={styles.mainArea}>
        <TopBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          scrollOpacity={scrollOpacity}
        />
        <div className={styles.contentArea} ref={contentRef}>
          {renderContent()}
        </div>
      </div>
      <div className={styles.playerBar}>
        <NowPlayingBar
          track={playback.currentTrack}
          isPlaying={playback.isPlaying}
          progress={playback.progress}
          volume={playback.volume}
          onPlayPause={playback.togglePlay}
          onProgressChange={playback.setProgress}
          onVolumeChange={playback.setVolume}
        />
      </div>
    </div>
  );
}

export default App;
