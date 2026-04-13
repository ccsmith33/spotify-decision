# ADR-008: Spotify Web Playback SDK for Browser Playback

## Status
Accepted

## Context
The v1 app simulates music playback with a timer-based hook (`usePlaybackSimulation`). With Spotify integration, we want real music playback in the browser to make the demo fully functional.

## Options Considered

1. **Keep simulation only**: No real playback. The NowPlayingBar continues as a visual mockup.
2. **Web Playback SDK**: Spotify's official JavaScript SDK creates a player device in the browser. Requires Premium. Falls back to simulation for Free users.
3. **Embed Spotify iframes**: Use Spotify's embed player. Limited controls, not a full player experience.

## Decision
Option 2: Web Playback SDK with graceful fallback to simulation.

## Rationale
- The SDK provides full playback control (play, pause, skip, seek, volume) — matching what the NowPlayingBar UI already displays
- Creates a compelling demo: real music plays while explaining how the recommendation algorithm works
- Premium requirement is acceptable — the presenter (project team member) can use their own Premium account for the demo
- Non-Premium and unauthenticated users see the existing simulation — no degraded experience
- The `useSpotifyPlayer` hook interface mirrors `usePlaybackSimulation`, so the NowPlayingBar needs minimal changes

## Consequences
- Requires at least one team member to have Spotify Premium for the live demo
- SDK script loaded from Spotify CDN (external dependency at runtime)
- Must handle the case where the SDK fails to initialize (network issues, account issues)

## References
- D-013 in decision log
- Spotify Web Playback SDK docs: https://developer.spotify.com/documentation/web-playback-sdk
