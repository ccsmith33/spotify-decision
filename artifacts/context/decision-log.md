# Decision Log

## Strategic Decisions

### D-001: Tech Stack Selection
- **Date**: 2026-04-13
- **Status**: decided
- **Decision**: Vite + React + TypeScript
- **Rationale**: Matches swarm.yaml language requirement (TypeScript). Vite provides fast dev server and build. React is the dominant SPA framework with the best component ecosystem.
- **Affects**: All implementation work

### D-002: Single Developer (No Parallel Devs)
- **Date**: 2026-04-13
- **Status**: decided
- **Decision**: Use 1 developer instead of 2 parallel devs
- **Rationale**: Greenfield project means both developers would create overlapping foundational files (package.json, App component, shared styles, routing). Merge conflicts would cost more time than parallelism saves.
- **Affects**: Implementation phase speed and coordination

### D-003: Skip Story Engineer
- **Date**: 2026-04-13
- **Status**: decided
- **Decision**: Architect produces implementation-ready specs instead of separate story files
- **Rationale**: User wants same-day delivery. Adding a story-engineer adds a sequential phase. The architect's output will include enough detail (component specs, file paths, mock data structures) to guide the developer directly.
- **Affects**: Developer workflow -- works from architecture doc instead of story files

### D-004: Frontend-Only with Mock Data
- **Date**: 2026-04-13
- **Status**: decided
- **Decision**: Build frontend-only demo with embedded mock data. No backend server.
- **Rationale**: User said "we do NOT need a full backend, just enough of a backend (or even integrated into the frontend) to make the demo work." Mock data in the frontend is the fastest path. Can add backend later if time permits.
- **Affects**: Data layer design, deployment simplicity

### D-005: Reveal.js in React Component
- **Date**: 2026-04-13
- **Status**: decided
- **Decision**: Embed reveal.js inside a React component for the presentation tab
- **Rationale**: Keeps the entire app as a single SPA. reveal.js can be initialized/destroyed on tab switch. Avoids iframe complexity.
- **Affects**: Presentation tab implementation

### D-006: Add Video Tab
- **Date**: 2026-04-13
- **Status**: decided
- **Decision**: Add a 4th tab for embedded presentation video (Demo | Presentation | Video | Appendix)
- **Rationale**: User wants a fallback recording of the live presentation for TAs to review. HTML5 video player with placeholder state, styled to match Spotify. Simple file path config so a video can be dropped in later.
- **Affects**: Tab system design, component count, architecture doc

### D-007: Tab Navigation via React State
- **Date**: 2026-04-13
- **Status**: decided
- **Decision**: Use React useState for tab switching instead of React Router
- **Rationale**: 4 fixed tabs, no deep linking needed, zero dependencies, simplest approach for a presentation context. See ADR-001.
- **Affects**: App.tsx, TopBar component

### D-008: CSS Modules + Custom Properties for Styling
- **Date**: 2026-04-13
- **Status**: decided
- **Decision**: CSS Modules for component scoping, CSS custom properties for global Spotify design tokens
- **Rationale**: Zero runtime cost, built-in Vite support, mirrors Spotify's own Encore design system approach. See ADR-002.
- **Affects**: All component styling

### D-009: Recharts for Fairness Metrics, CSS for Factor Bars
- **Date**: 2026-04-13
- **Status**: decided
- **Decision**: Recharts for fairness dashboard visualizations, pure CSS for algorithm factor stacked bars
- **Rationale**: Right abstraction level for each use case. Recharts provides responsive containers and reference lines for metrics; CSS flexbox is simpler for stacked bars. See ADR-003.
- **Affects**: FairnessMetricCard, FactorBreakdown components

### D-010: Three-Tier Explanation Detail Levels
- **Date**: 2026-04-13
- **Status**: decided
- **Decision**: Basic / Detailed / Technical explanation tiers with user toggle
- **Rationale**: Maps to three user profiles from testing (casual/engaged/power). Explanation entity already has three fields. User-controlled toggle respects agency. See ADR-004.
- **Affects**: Explanation mock data, TransparencyControls, DecisionCard, RecommendationList, DecisionHistory

## Tactical Decisions

(Logged by agents during implementation)
