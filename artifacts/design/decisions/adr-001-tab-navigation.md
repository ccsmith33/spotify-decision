# ADR-001: Tab Navigation Approach

## Status
Decided

## Context
The app has 4 tabs (Demo, Presentation, Video, Appendix). We need a mechanism to switch between them. The Spotify UI shell (sidebar, top bar, now playing bar) must persist across all tabs -- only the main content area changes.

## Options Considered

### Option A: React Router (react-router-dom)
- Provides URL-based routing (`/demo`, `/presentation`, etc.)
- Supports browser back/forward, deep linking
- Adds a dependency (~15KB)
- Requires wrapping app in BrowserRouter, using Routes/Route components

### Option B: React useState
- Simple `activeTab` state in App.tsx
- Tab switcher calls `setActiveTab`
- Conditional rendering in JSX: `{activeTab === "demo" && <DemoPage />}`
- Zero dependencies
- No URL changes

### Option C: URL hash (#demo, #presentation)
- Manual hash change listener
- Lightweight, supports bookmarking
- Requires custom implementation

## Decision
**Option B: React useState**

## Rationale
- This is a presentation tool, not a production web app. Deep linking and browser history are not needed.
- The 4 tabs are a fixed, known set. No dynamic routing is required.
- Avoiding React Router removes a dependency and simplifies the component tree.
- The Spotify UI already has its own navigation pattern (sidebar). Our tab switcher is styled as filter chips in the top bar, which is a visual element, not a URL-driven router.
- If deep linking is ever needed, it's trivial to add hash-based routing later.

## Consequences
- Tab state resets on page refresh (always starts on Demo tab). Acceptable for a presentation context.
- Browser back/forward buttons do not navigate between tabs. The decorative back/forward arrows in the TopBar reinforce the Spotify aesthetic without adding navigation behavior.
- Simpler mental model for the developer: one piece of state controls content rendering.
