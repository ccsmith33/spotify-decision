import type { TabId, DetailLevel } from './data/types';
import { useState, useRef } from 'react';
import { useScrollOpacity } from './hooks/useScrollOpacity';
import { SpotifyProvider } from './context/SpotifyProvider';
import { useSpotify } from './context/SpotifyContext';
import { Sidebar } from './components/shell/Sidebar';
import { TopBar } from './components/shell/TopBar';
import { NowPlayingBar } from './components/shell/NowPlayingBar';
import { DemoPage } from './components/demo/DemoPage';
import { PlaylistDetailView } from './components/demo/PlaylistDetailView';
import { PresentationPage } from './components/presentation/PresentationPage';
import { VideoPage } from './components/video/VideoPage';
import { AppendixPage } from './components/appendix/AppendixPage';
import styles from './App.module.css';

function AppInner() {
  const [activeTab, setActiveTab] = useState<TabId>('demo');
  const [detailLevel, setDetailLevel] = useState<DetailLevel>('basic');
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollOpacity = useScrollOpacity(contentRef);
  const { playback, user, isAuthenticated, login, logout, selectedPlaylist, selectPlaylist, playlistTracks, isLoadingPlaylist } = useSpotify();

  const handleSelectPlaylist = (playlist: { id: string; name: string; imageUrl: string | null; description: string }) => {
    setActiveTab('demo');
    selectPlaylist(playlist);
  };

  const renderContent = () => {
    if (selectedPlaylist && activeTab === 'demo') {
      return (
        <PlaylistDetailView
          playlist={selectedPlaylist}
          tracks={playlistTracks}
          isLoading={isLoadingPlaylist}
          detailLevel={detailLevel}
          transparencyExplanation={selectedPlaylist.description || undefined}
          onBack={() => selectPlaylist(null)}
        />
      );
    }

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
      <Sidebar activeTab={activeTab} onSelectPlaylist={handleSelectPlaylist} />
      <div className={styles.mainArea}>
        <TopBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          scrollOpacity={scrollOpacity}
          user={user}
          isAuthenticated={isAuthenticated}
          onLogin={login}
          onLogout={logout}
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
          albumImageUrl={playback.albumImageUrl}
          onPlayPause={playback.togglePlay}
          onNext={playback.nextTrack}
          onPrevious={playback.previousTrack}
          onProgressChange={playback.setProgress}
          onVolumeChange={playback.setVolume}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <SpotifyProvider>
      <AppInner />
    </SpotifyProvider>
  );
}

export default App;
