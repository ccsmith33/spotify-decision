# ADR-007: Dual-Mode Data Context (Mock + Live)

## Status
Accepted

## Context
The app currently uses embedded mock data for all demo page content. With Spotify integration, the same components need to display either mock data (for unauthenticated users) or real Spotify data (for authenticated users). The demo must always work, even without a Spotify account.

## Options Considered

1. **Separate components for mock vs live**: Duplicate demo components — one set for mock, one for live data.
2. **React Context with dual mode**: A single context provides data to all components. Internally, it switches between mock data imports and Spotify API calls based on auth state.
3. **Props-only approach**: Pass data source down through props from App.tsx, no context.

## Decision
Option 2: React Context with dual mode.

## Rationale
- Components remain unchanged — they consume data through the same interfaces regardless of source
- No component duplication (DRY)
- Context avoids deep prop drilling through the component tree (App -> DemoPage -> RecommendationList -> FactorBreakdown)
- Auth state, user profile, playback state, and data all live in one coherent provider
- Existing mock data modules (`src/data/*.ts`) remain untouched as the fallback layer
- Per-section fallback: if one API call fails, only that section falls back to mock data, others continue with live data

## Consequences
- Adds a context provider to the component tree
- Components must be wrapped in the provider (straightforward change in App.tsx)
- Loading states needed for the transition period while API data is being fetched

## References
- D-014 in decision log
