export function loadSpotifySDK(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Spotify) {
      resolve();
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => resolve();
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    document.body.appendChild(script);
  });
}
