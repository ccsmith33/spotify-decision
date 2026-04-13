declare namespace Spotify {
  interface Player {
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener(event: string, callback: Function): void;
    removeListener(event: string, callback?: Function): void;
    getCurrentState(): Promise<PlaybackState | null>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(positionMs: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
  }

  interface PlaybackState {
    paused: boolean;
    position: number;
    duration: number;
    track_window: {
      current_track: WebPlaybackTrack;
      previous_tracks: WebPlaybackTrack[];
      next_tracks: WebPlaybackTrack[];
    };
  }

  interface WebPlaybackTrack {
    uri: string;
    id: string;
    name: string;
    duration_ms: number;
    artists: { name: string; uri: string }[];
    album: {
      name: string;
      uri: string;
      images: { url: string; width: number; height: number }[];
    };
  }
}

interface Window {
  Spotify: {
    Player: new (options: {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }) => Spotify.Player;
  };
  onSpotifyWebPlaybackSDKReady: () => void;
}
