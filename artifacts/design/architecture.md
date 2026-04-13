# Architecture: Decision Transparency Portal

## 1. System Overview

A single-page React application with four tabs, wrapped in a pixel-perfect Spotify Web Player UI shell. The app uses frontend-only mock data (D-004) and is built with Vite + React + TypeScript (D-001). There is no backend server. All data is embedded in TypeScript modules.

The four tabs are:
1. **Demo** -- The Decision Transparency Portal as if it were a real Spotify feature
2. **Presentation** -- reveal.js slides embedded in React (D-005)
3. **Video** -- HTML5 video player for uploaded presentation recording (D-006)
4. **Appendix** -- Supporting explanations of semester work

The Spotify shell (sidebar, top bar, now playing bar) is persistent across all tabs. Tab switching replaces only the main content area.

---

## 2. Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Build tool | Vite 6 | D-001. Fast HMR, native TypeScript, optimized production builds |
| UI framework | React 19 | D-001. Component-based, dominant ecosystem |
| Language | TypeScript 5.7 | D-001. Type safety for mock data interfaces and component props |
| Routing | React state (no router) | 4 tabs with no deep linking needed. Simple useState avoids a dependency |
| Styling | CSS Modules + CSS custom properties | Scoped styles per component, global Spotify design tokens via custom properties |
| Presentation | reveal.js 5 | D-005. Embedded in React via useEffect lifecycle |
| Icons | Lucide React | Closest match to Spotify's icon style. Tree-shakeable, consistent 24px grid |
| Charts | Recharts | Lightweight, React-native charting for fairness metric visualizations |
| Testing | Vitest + React Testing Library | Matches Vite ecosystem. Fast, Jest-compatible API |
| Deployment | Vite static build -> DigitalOcean | D-004. `vite build` produces static assets, served by nginx |

---

## 3. Project Structure

```
src/
├── main.tsx                          # React entry point
├── App.tsx                           # Root component: shell + tab state
├── App.module.css                    # Root layout (grid for shell)
├── index.css                         # Global reset + CSS custom properties (design tokens)
│
├── components/
│   ├── shell/
│   │   ├── Sidebar.tsx               # Left sidebar with nav panels
│   │   ├── Sidebar.module.css
│   │   ├── TopBar.tsx                # Top bar with nav arrows, tab switcher, user avatar
│   │   ├── TopBar.module.css
│   │   ├── NowPlayingBar.tsx         # Bottom bar with album art, controls, progress
│   │   ├── NowPlayingBar.module.css
│   │   ├── PlaybackControls.tsx      # Center section: play/pause, skip, shuffle, repeat
│   │   ├── PlaybackControls.module.css
│   │   ├── ProgressBar.tsx           # Reusable progress/volume slider
│   │   └── ProgressBar.module.css
│   │
│   ├── demo/
│   │   ├── DemoPage.tsx              # Demo tab root: scrollable transparency portal
│   │   ├── DemoPage.module.css
│   │   ├── HeroSection.tsx           # Gradient hero with portal title and description
│   │   ├── HeroSection.module.css
│   │   ├── DecisionCard.tsx          # Card showing an algorithm decision with explanation
│   │   ├── DecisionCard.module.css
│   │   ├── FactorBreakdown.tsx       # Horizontal bar visualization of algorithm factors
│   │   ├── FactorBreakdown.module.css
│   │   ├── RecommendationList.tsx    # Track list of recommendations with transparency info
│   │   ├── RecommendationList.module.css
│   │   ├── FairnessSection.tsx       # Fairness audit dashboard with metrics
│   │   ├── FairnessSection.module.css
│   │   ├── FairnessMetricCard.tsx    # Individual metric: current vs target with bar
│   │   ├── FairnessMetricCard.module.css
│   │   ├── AppealSection.tsx         # Appeal mechanism: form + process explanation
│   │   ├── AppealSection.module.css
│   │   ├── DecisionHistory.tsx       # Timeline of past algorithm decisions
│   │   ├── DecisionHistory.module.css
│   │   ├── GlossaryPanel.tsx         # Expandable glossary for technical terms
│   │   ├── GlossaryPanel.module.css
│   │   ├── TransparencyControls.tsx  # User controls: explanation detail level, notification prefs
│   │   └── TransparencyControls.module.css
│   │
│   ├── presentation/
│   │   ├── PresentationPage.tsx      # Presentation tab: mounts/unmounts reveal.js
│   │   └── PresentationPage.module.css
│   │
│   ├── video/
│   │   ├── VideoPage.tsx             # Video tab: HTML5 player or placeholder
│   │   └── VideoPage.module.css
│   │
│   └── appendix/
│       ├── AppendixPage.tsx          # Appendix tab: structured sections
│       └── AppendixPage.module.css
│
├── data/
│   ├── types.ts                      # TypeScript interfaces for ALL data entities
│   ├── tracks.ts                     # Mock tracks, artists, albums
│   ├── decisions.ts                  # Mock algorithm decisions + explanations
│   ├── fairness.ts                   # Mock fairness audit data + metrics
│   ├── interactions.ts               # Mock interaction data (plays, skips, likes)
│   ├── appeals.ts                    # Mock appeal records
│   ├── recommendations.ts            # Mock recommendation sets with factor breakdowns
│   ├── glossary.ts                   # Glossary term definitions
│   └── playlists.ts                  # Mock playlists for sidebar
│
├── hooks/
│   ├── usePlaybackSimulation.ts      # Simulates track progress for now-playing bar
│   └── useScrollOpacity.ts           # Top bar background opacity on scroll
│
└── assets/
    ├── album-covers/                 # 6-8 square images for mock album art
    └── presentation/                 # reveal.js slide assets (if any)
```

---

## 4. Component Hierarchy

```
<App>
  ├── <Sidebar>
  │     ├── Navigation panel (Home icon, Search icon)
  │     └── Library panel (playlist items from mock data)
  │
  ├── <main area>
  │     ├── <TopBar>
  │     │     ├── Back/Forward nav arrows
  │     │     ├── Tab switcher: Demo | Presentation | Video | Appendix
  │     │     └── User avatar dropdown
  │     │
  │     └── <content area> (switches on active tab)
  │           ├── <DemoPage>           (tab === "demo")
  │           ├── <PresentationPage>   (tab === "presentation")
  │           ├── <VideoPage>          (tab === "video")
  │           └── <AppendixPage>       (tab === "appendix")
  │
  └── <NowPlayingBar>
        ├── Left: album art + track info
        ├── Center: <PlaybackControls> + <ProgressBar>
        └── Right: volume <ProgressBar> + utility icons
```

---

## 5. Component Specifications

### 5.1 App (Root)

**File:** `src/App.tsx`

```typescript
interface AppState {
  activeTab: "demo" | "presentation" | "video" | "appendix";
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;       // 0-100
  volume: number;         // 0-100
}
```

**Responsibilities:**
- Manages tab state and passes `activeTab` + `setActiveTab` to TopBar
- Manages playback simulation state (currentTrack, isPlaying, progress, volume)
- Renders the 3-region CSS Grid layout: sidebar | main+topbar | now-playing-bar

**Layout CSS Grid:**
```css
.app {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  grid-template-rows: 1fr var(--player-height);
  height: 100vh;
  background: var(--bg-sidebar);
  padding: var(--spacing-sm);
  gap: var(--spacing-sm);
}
```

### 5.2 Sidebar

**File:** `src/components/shell/Sidebar.tsx`

```typescript
interface SidebarProps {
  activeTab: string;
  playlists: Playlist[];
}
```

**Structure:**
- Outer container: `#000000` background, 8px padding, flex column, 8px gap
- **Nav panel**: `#121212` bg, 8px border-radius, 8px padding
  - Home nav item: 40px height, 24px icon, 14px bold text
  - Search nav item: same dimensions
- **Library panel**: `#121212` bg, 8px border-radius, flex-grow 1, overflow hidden
  - Header row: "Your Library" label + icon buttons
  - Filter chips: pill-shaped, `#232323` bg, 8px 12px padding
  - Playlist list: scrollable, each item 56px height with 48x48 thumbnail

### 5.3 TopBar

**File:** `src/components/shell/TopBar.tsx`

```typescript
interface TopBarProps {
  activeTab: "demo" | "presentation" | "video" | "appendix";
  onTabChange: (tab: "demo" | "presentation" | "video" | "appendix") => void;
  scrollOpacity: number;  // 0-1, from useScrollOpacity hook
}
```

**Structure:**
- 64px height, sticky top within content area
- Background: `rgba(18, 18, 18, scrollOpacity)` -- transparent at top, solid on scroll
- Left: back/forward chevron icons (decorative, non-functional)
- Center: **Tab switcher** -- 4 pill-shaped buttons styled like Spotify filter chips
  - Active tab: `#ffffff` text, `#333333` background
  - Inactive: `#b3b3b3` text, transparent background
  - Hover: text brightens to white
- Right: user avatar circle (decorative)

**Tab Switcher Design:**
The tabs are styled as filter chips (like Spotify's "All", "Music", "Podcasts" pills on the home page), placed in the center of the top bar. This integrates naturally into Spotify's UI without looking like foreign navigation.

### 5.4 NowPlayingBar

**File:** `src/components/shell/NowPlayingBar.tsx`

```typescript
interface NowPlayingBarProps {
  track: Track;
  isPlaying: boolean;
  progress: number;
  volume: number;
  onPlayPause: () => void;
  onProgressChange: (val: number) => void;
  onVolumeChange: (val: number) => void;
}
```

**Structure:**
- 72px height, `#181818` background, `1px solid #000` top border
- 3-column flex layout (30% / 40% / 30%)
- **Left column:** 56x56 album art (border-radius 4px) + song title (14px bold white) + artist (12px `#b3b3b3`)
- **Center column:** PlaybackControls + ProgressBar
- **Right column:** volume ProgressBar + queue/devices/fullscreen icons

### 5.5 PlaybackControls

**File:** `src/components/shell/PlaybackControls.tsx`

```typescript
interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
}
```

**Structure:**
- Flex row, centered, gap 16px
- Shuffle icon (16px, `#b3b3b3`)
- Previous track icon (16px)
- Play/Pause button: 32px white circle, black icon, `scale(1.06)` on hover
- Next track icon (16px)
- Repeat icon (16px)

### 5.6 ProgressBar

**File:** `src/components/shell/ProgressBar.tsx`

```typescript
interface ProgressBarProps {
  value: number;          // 0-100
  onChange: (val: number) => void;
  showTime?: boolean;     // show mm:ss labels
  currentTime?: number;   // seconds
  duration?: number;      // seconds
}
```

**Structure:**
- Track: 4px height, `#4d4d4d` background, border-radius 2px
- Fill: `#ffffff` default, `#1ed760` on hover
- Knob: 12px white circle, appears on hover
- Time labels (if showTime): 11px `#a7a7a7`

---

## 6. Demo Page Design

The Demo page is the core deliverable. It presents the Decision Transparency Portal as if it were a real Spotify feature page. The content is a single scrollable page organized into sections that map directly to the product backlog priorities and data model entities.

### 6.1 Page Layout

```
┌─────────────────────────────────────────────────┐
│  HeroSection                                     │
│  "Algorithmic Transparency"                      │
│  Gradient header with portal description         │
├─────────────────────────────────────────────────┤
│  GlossaryPanel (expandable, addresses Action 1)  │
├─────────────────────────────────────────────────┤
│  Section: "How Your Recommendations Work"        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │DecisionCa│ │DecisionCa│ │DecisionCa│        │
│  │rd        │ │rd        │ │rd        │        │
│  └──────────┘ └──────────┘ └──────────┘        │
├─────────────────────────────────────────────────┤
│  Section: "Your Recent Recommendations"          │
│  RecommendationList (track list with factors)    │
│  └── Per-track FactorBreakdown on expand        │
├─────────────────────────────────────────────────┤
│  Section: "Transparency Controls"                │
│  TransparencyControls                            │
├─────────────────────────────────────────────────┤
│  Section: "Fairness & Oversight"                 │
│  FairnessSection                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │FairnessMe│ │FairnessMe│ │FairnessMe│        │
│  │tricCard  │ │tricCard  │ │tricCard  │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│  Aggregate vs individual callout (Action 3)      │
├─────────────────────────────────────────────────┤
│  Section: "Decision History"                     │
│  DecisionHistory (timeline)                      │
├─────────────────────────────────────────────────┤
│  Section: "Challenge a Decision"                 │
│  AppealSection (form + process + outcomes)        │
└─────────────────────────────────────────────────┘
```

### 6.2 Section-to-Source Mapping

| Demo Section | Backlog Stories | Data Model Entity | User Testing Action |
|---|---|---|---|
| HeroSection | #1 (understand decisions) | -- | -- |
| GlossaryPanel | #9 (clear definitions) | -- | Action 1: terminology glossary |
| How Recommendations Work | #2 (plain-language), #3 (data factors) | Algorithm_Decision, Explanation | -- |
| Your Recent Recommendations | #3 (data factors) | Algorithm_Decision, Explanation, Interaction | -- |
| Transparency Controls | #2 (plain-language) | Explanation (detail levels) | -- |
| Fairness & Oversight | #4 (fairness section), #8 (fairness metrics) | Fairness_Audit | Action 2: current + target metrics; Action 3: aggregate vs individual |
| Decision History | #6 (audit logs -- simplified) | Algorithm_Decision | -- |
| Challenge a Decision | #5 (appeal), #10 (post-appeal) | Appeal | Action 4: post-appeal outcomes; Action 5: navigation discoverability |

### 6.3 Demo Component Details

#### HeroSection

**File:** `src/components/demo/HeroSection.tsx`

- Gradient background extracted from a mock album cover's dominant color, fading to `#121212` over ~300px (matching Spotify's page header pattern)
- Large title: "Algorithmic Transparency" (32px bold white)
- Subtitle: "Understand how your music recommendations are made, how we ensure fairness, and how to challenge decisions." (16px `#b3b3b3`)
- Spotify-style category tag: "TRANSPARENCY PORTAL" (10px uppercase, letter-spacing 1.5px)
- This maps to **Backlog #1**: user understands what automated decisions the platform makes

#### GlossaryPanel

**File:** `src/components/demo/GlossaryPanel.tsx`

```typescript
interface GlossaryPanelProps {
  terms: GlossaryTerm[];
  isExpanded: boolean;
  onToggle: () => void;
}
```

- Collapsible panel at top of page, styled like a Spotify notification bar
- Collapsed: "Need help with terms? Open glossary" with chevron icon
- Expanded: grid of term cards, each with term name (bold) and plain-language definition with music example
- Addresses **User Testing Action 1**: terminology glossary with concrete examples
- Addresses **Backlog #9**: clear definitions of technical terms

#### DecisionCard

**File:** `src/components/demo/DecisionCard.tsx`

```typescript
interface DecisionCardProps {
  decision: AlgorithmDecision;
  explanation: Explanation;
}
```

- Styled as a Spotify content card (`#181818` bg, 8px radius, 16px padding)
- Shows decision type icon, plain-language title, and explanation text
- Explanation renders at the user's selected detail level (basic / detailed / technical)
- Three cards shown for the three decision types: Playlist Curation, Song Radio, Discover Weekly
- Maps to **Backlog #2** and **#3**, uses **Algorithm_Decision** and **Explanation** entities

#### FactorBreakdown

**File:** `src/components/demo/FactorBreakdown.tsx`

```typescript
interface FactorBreakdownProps {
  factors: AlgorithmFactor[];
}
```

- Horizontal stacked bar showing algorithm factor weights (listening history, audio features, collaborative filtering, editorial curation, recency)
- Each segment is a different shade with label and percentage
- Green accent (`#1DB954`) for the dominant factor
- Plain-language tooltip on hover explaining each factor
- Maps to **Backlog #3**: data factors influencing recommendations

#### RecommendationList

**File:** `src/components/demo/RecommendationList.tsx`

```typescript
interface RecommendationListProps {
  recommendations: Recommendation[];
}
```

- Styled as a Spotify track list table (56px rows, 5-column grid)
- Columns: #, Title+Artist, Album, Why (short explanation), Duration
- Clicking a row expands an inline FactorBreakdown below it
- The "Why" column is the transparency addition -- shows top reason in `#1ed760` text
- Uses **Algorithm_Decision**, **Explanation**, and **Interaction** entities

#### FairnessSection

**File:** `src/components/demo/FairnessSection.tsx`

```typescript
interface FairnessSectionProps {
  audits: FairnessAudit[];
}
```

- Section header with "Fairness & Oversight" title
- **Aggregate vs Individual callout**: prominent info box (`#282828` bg, `#539df5` left border) explaining that metrics are platform-wide, not per-user guarantees. Uses analogy: "Think of it like a city's air quality index -- it measures the whole city, not your living room." This directly addresses **User Testing Action 3**.
- Grid of FairnessMetricCard components
- "Last audited" timestamp for credibility
- Links to "Challenge a Decision" at bottom (addresses **User Testing Action 5**)
- Maps to **Backlog #4** and **#8**, uses **Fairness_Audit** entity

#### FairnessMetricCard

**File:** `src/components/demo/FairnessMetricCard.tsx`

```typescript
interface FairnessMetricCardProps {
  metric: FairnessMetric;
}
```

- Card showing metric name, current value, target, and last updated date
- Horizontal bar: filled to current percentage, target marked with a line
- Shows both current AND target values (addresses **User Testing Action 2**)
- Color: green if meeting/exceeding target, warning orange if below
- Trend indicator: up/down arrow with "from last month" context
- Example metrics: Independent Artist Exposure (Current: 12.3% | Target: 15%), Genre Diversity Score (Current: 0.78 | Target: 0.80), New Artist Discovery Rate (Current: 8.1% | Target: 10%)

#### AppealSection

**File:** `src/components/demo/AppealSection.tsx`

```typescript
interface AppealSectionProps {
  existingAppeals: Appeal[];
  onSubmit: (appeal: AppealFormData) => void;
}
```

- Split layout: left side is appeal form, right side is process explanation
- **Form fields:** decision type dropdown, description textarea, desired outcome dropdown
- **Process explanation:** numbered steps (1. Submit -> 2. Human Review -> 3. Decision -> 4. Resolution)
  - Includes specific timeline: "5-7 business days"
  - Includes **post-appeal outcomes** section (addresses **User Testing Action 4**): "After review, you will receive an email with: the review decision, specific actions taken (if any), explanation of the reasoning, and how to escalate if dissatisfied"
- **Previous appeals** list below form showing mock appeal statuses
- Prominent placement + "Challenge a Decision" link from FairnessSection addresses **User Testing Action 5**
- Maps to **Backlog #5** and **#10**, uses **Appeal** entity

#### DecisionHistory

**File:** `src/components/demo/DecisionHistory.tsx`

```typescript
interface DecisionHistoryProps {
  decisions: AlgorithmDecision[];
}
```

- Vertical timeline styled with Spotify's dark card aesthetic
- Each entry: timestamp, decision type, brief description, "View details" expand
- Most recent at top
- Simplified version of **Backlog #6** (audit logs) adapted for user-facing display
- Uses **Algorithm_Decision** entity

#### TransparencyControls

**File:** `src/components/demo/TransparencyControls.tsx`

```typescript
interface TransparencyControlsProps {
  detailLevel: "basic" | "detailed" | "technical";
  onDetailLevelChange: (level: "basic" | "detailed" | "technical") => void;
  notificationsEnabled: boolean;
  onNotificationsToggle: () => void;
}
```

- Card with user preference controls
- **Explanation detail level**: 3 radio-style options styled as Spotify filter chips
  - Basic: "Just the essentials" (for casual users like P3)
  - Detailed: "Show me more" (for engaged users like P2)
  - Technical: "Full transparency" (for power users like P1)
- **Notification preferences**: toggle for fairness report updates
- Changing detail level updates all DecisionCard and RecommendationList explanations
- Addresses the user testing finding that casual vs power users need different levels

### 6.4 Stakeholder-Informed Design Decisions

The four stakeholder groups from the change management analysis inform the Demo page's tone and content:

| Stakeholder | How the Demo Reflects Their Needs |
|---|---|
| **Privacy Advocates** | Explanations show clear boundaries on what is/isn't disclosed. Audit trail is visible. Appeal mechanism provides accountability. |
| **Independent Artists** | Fairness metrics specifically highlight independent artist exposure with current data vs targets. Concrete numbers, not vague promises. |
| **Engineering Teams** | Technical detail level option shows that proprietary logic can be protected while still offering transparency. |
| **Executive Leadership** | The portal is framed as a trust-building feature, not a liability. Competitive positioning as industry-leading transparency. |

---

## 7. Presentation Tab

### 7.1 PresentationPage

**File:** `src/components/presentation/PresentationPage.tsx`

```typescript
interface PresentationPageProps {
  // No props needed; slides are self-contained
}
```

**Implementation (D-005):**
- On mount: creates a div container, initializes `Reveal()` with config
- On unmount: calls `Reveal.destroy()` to clean up DOM and event listeners
- Reveal.js config: `embedded: true`, `hash: false`, `controls: true`, `progress: true`
- Theme: custom dark theme matching Spotify colors (`#121212` background, white text, `#1DB954` accents)
- Container fills the main content area minus TopBar height
- Slides are defined as JSX within the component. Group members will fill in content later; placeholder structure provided:

```
Slide 1: Title slide (project name, team, date)
Slide 2-3: Problem & Context
Slide 4-5: Our Approach
Slide 6-7: Demo Highlights
Slide 8: Key Findings
Slide 9: Recommendations
Slide 10: Q&A
```

**Lifecycle management:**
```typescript
useEffect(() => {
  const deck = new Reveal(containerRef.current, {
    embedded: true,
    hash: false,
    controls: true,
    progress: true,
    transition: 'slide',
    width: '100%',
    height: '100%',
  });
  deck.initialize();
  return () => deck.destroy();
}, []);
```

---

## 8. Video Tab

### 8.1 VideoPage

**File:** `src/components/video/VideoPage.tsx`

```typescript
interface VideoPageProps {
  // No props; video source is configured via constant
}
```

**Configuration:**
```typescript
// At top of VideoPage.tsx -- change this path when video is ready
const VIDEO_SRC: string | null = null;
// When ready: const VIDEO_SRC = "/assets/presentation-recording.mp4";
```

**Two states:**

1. **Placeholder state** (when `VIDEO_SRC` is null):
   - Centered card (`#181818` bg) with film icon, "Presentation Recording" title
   - "Video will be available after the live presentation" subtitle
   - Styled like a Spotify "content not available" state

2. **Player state** (when `VIDEO_SRC` has a value):
   - HTML5 `<video>` element with native controls
   - Dark container matching Spotify aesthetic
   - Custom styled wrapper: `#000` background, centered video, max-width 960px
   - Controls bar styled to match Spotify's dark theme (browser native controls are acceptable since custom video controls are complex and low-value)

---

## 9. Appendix Tab

### 9.1 AppendixPage

**File:** `src/components/appendix/AppendixPage.tsx`

```typescript
interface AppendixPageProps {
  // No props; content is embedded
}
```

**Structure:**
- Scrollable page with sections styled as Spotify cards
- Each section has a title, description, and expandable content area
- Template sections (group members fill in content later):

```
1. Project Brief & Background
   - How the project was scoped and what problem it addresses

2. Data Model
   - Entity descriptions and relationships
   - How the data model informed the demo

3. User Testing
   - Testing methodology and key findings
   - How findings shaped the final design

4. Product Backlog & Sprint Planning
   - Prioritization approach and story selection
   - What was built vs deferred

5. Change Management
   - Stakeholder analysis summary
   - How stakeholder needs influenced the portal

6. Technical Approach
   - Technology choices and architecture rationale
   - How the demo was built
```

Each section is a collapsible card. Content is stored as JSX strings in the component. Group members can edit the text content directly.

---

## 10. Mock Data Schema

All TypeScript interfaces live in `src/data/types.ts`. These map directly to the data model entities from the semester assignment.

```typescript
// ============================================================
// Core Platform Entities
// ============================================================

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  isIndependent: boolean;      // Key for fairness metrics
  genres: string[];
  monthlyListeners: number;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  coverUrl: string;
  releaseYear: number;
  dominantColor: string;       // For gradient headers
}

export interface Track {
  id: string;
  title: string;
  artistId: string;
  albumId: string;
  durationMs: number;
  popularity: number;          // 0-100
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  trackIds: string[];
  isAlgorithmic: boolean;      // true for Discover Weekly etc.
}

// ============================================================
// Data Model Entities (from semester Data Modeling Assignment)
// ============================================================

/**
 * Algorithm_Decision: Tracks what decisions were made, how, and why.
 * Independent from recommendations -- allows tracking decision patterns.
 */
export interface AlgorithmDecision {
  id: string;
  type: "playlist_curation" | "song_radio" | "discover_weekly" | "home_feed" | "search_ranking";
  timestamp: string;           // ISO 8601
  description: string;         // Plain-language summary of what was decided
  factors: AlgorithmFactor[];  // What influenced this decision
  confidence: number;          // 0-1, algorithm's confidence in this decision
  trackIds: string[];          // Tracks affected by this decision
  explanationId: string;       // Links to Explanation entity
}

export interface AlgorithmFactor {
  name: string;                // e.g., "Listening History", "Audio Features"
  weight: number;              // 0-1, how much this factor influenced the decision
  description: string;         // Plain-language explanation
}

/**
 * Explanation: User-facing transparency content at different detail levels.
 * Stores multiple explanation tiers without exposing proprietary logic.
 */
export interface Explanation {
  id: string;
  decisionId: string;          // Links back to AlgorithmDecision
  basic: string;               // For casual users (Flesch-Kincaid grade 8 or below)
  detailed: string;            // For engaged users
  technical: string;           // For power users
  disclosureBoundary: string;  // What is NOT shared and why
  generatedAt: string;         // ISO 8601
}

/**
 * Fairness_Audit: Enables monitoring and evaluation of algorithmic bias.
 * Platform-wide metrics, NOT per-user guarantees.
 */
export interface FairnessAudit {
  id: string;
  auditDate: string;           // ISO 8601
  auditor: string;             // "Automated System" or team name
  metrics: FairnessMetric[];
  overallScore: number;        // 0-1 composite
  findings: string;            // Summary of audit findings
  recommendations: string;     // Actions recommended
}

export interface FairnessMetric {
  id: string;
  name: string;                // e.g., "Independent Artist Exposure"
  description: string;
  currentValue: number;
  targetValue: number;
  unit: string;                // e.g., "%", "score", "ratio"
  trend: "up" | "down" | "stable";
  previousValue: number;
  lastUpdated: string;         // ISO 8601
  category: "artist_visibility" | "genre_diversity" | "discovery" | "engagement_fairness";
}

/**
 * Interaction: Captures user engagement data to analyze algorithm-driven outcomes.
 */
export interface Interaction {
  id: string;
  trackId: string;
  type: "play" | "skip" | "like" | "save" | "share" | "add_to_playlist";
  timestamp: string;           // ISO 8601
  context: string;             // Where the interaction happened (e.g., "Discover Weekly", "Search")
  durationMs?: number;         // For play events: how long they listened
}

/**
 * Appeal: Human-in-the-loop review process for challenging automated decisions.
 */
export interface Appeal {
  id: string;
  userId: string;
  decisionId: string;          // Which AlgorithmDecision is being challenged
  status: "submitted" | "under_review" | "resolved" | "escalated";
  submittedAt: string;         // ISO 8601
  resolvedAt?: string;
  category: "recommendation_quality" | "visibility_bias" | "content_filtering" | "ranking_fairness";
  description: string;         // User's description of the issue
  desiredOutcome: string;      // What the user wants
  reviewerNotes?: string;      // Internal reviewer response
  resolution?: string;         // Final outcome description
  resolutionType?: "adjusted" | "no_change" | "escalated" | "policy_update";
}

// ============================================================
// Composite / View Types (for component props)
// ============================================================

export interface Recommendation {
  track: Track;
  artist: Artist;
  album: Album;
  decision: AlgorithmDecision;
  explanation: Explanation;
  topFactor: string;           // Single-line "why" for the track list column
}

export interface AppealFormData {
  category: Appeal["category"];
  description: string;
  desiredOutcome: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  example: string;             // Concrete music example
}
```

---

## 11. Styling Strategy

### 11.1 Global Design Tokens

All CSS custom properties from the Spotify UI research are defined in `src/index.css`. Every component references tokens, never raw hex values. The complete token set is reproduced from Section 11 of the UI research document.

### 11.2 CSS Modules

Each component has a co-located `.module.css` file. This provides:
- Scoped class names (no collisions)
- No runtime overhead (compiled at build time by Vite)
- TypeScript support via `*.module.css` type declarations

### 11.3 Naming Convention

CSS class names in modules use camelCase to match TypeScript object access:
```css
/* DecisionCard.module.css */
.card { }
.cardHeader { }
.cardTitle { }
.factorBar { }
```

### 11.4 Responsive Strategy

The demo is designed for desktop-first (this is a presentation for a classroom projector). Basic responsive support at two breakpoints:
- **Desktop** (default, 1024px+): Full sidebar, full layout
- **Tablet** (768-1023px): Narrower sidebar, 2-column grids
- No mobile layout is required (presentation context)

### 11.5 Scrollbar Styling

Custom thin scrollbars matching Spotify:
```css
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
```

### 11.6 Key Animations

| Element | Trigger | Animation |
|---|---|---|
| Card background | Hover | `background-color 300ms ease` |
| Card play button | Card hover | `opacity 0->1, translateY(8px)->0, 300ms ease` |
| Button scale | Hover | `transform: scale(1.04), 300ms ease` |
| Play button scale | Hover | `transform: scale(1.06), 300ms ease` |
| Top bar bg | Scroll | `background-color opacity` via scrollOpacity state |
| Progress bar fill | Hover | `#ffffff -> #1ed760` color change |
| Progress knob | Hover | `opacity 0->1` appear |

---

## 12. Hooks

### 12.1 usePlaybackSimulation

**File:** `src/hooks/usePlaybackSimulation.ts`

```typescript
interface PlaybackState {
  currentTrack: Track;
  isPlaying: boolean;
  progress: number;
  volume: number;
  togglePlay: () => void;
  setProgress: (val: number) => void;
  setVolume: (val: number) => void;
}
```

- Cycles through a small list of mock tracks
- When `isPlaying`, advances `progress` by a small increment every second
- When progress hits 100, moves to next track and resets
- Provides the illusion of a working music player

### 12.2 useScrollOpacity

**File:** `src/hooks/useScrollOpacity.ts`

```typescript
function useScrollOpacity(scrollRef: RefObject<HTMLElement>): number
```

- Attaches scroll listener to the main content area
- Returns a value from 0 (top) to 1 (scrolled 100px+)
- Used by TopBar to transition background from transparent to solid

---

## 13. Implementation Guide

This is the ordered step-by-step build plan. Each step produces a working (if incomplete) app. The developer works from this document directly (D-003).

### Step 1: Project Scaffold

**Goal:** Vite + React + TypeScript project running with empty shell.

**Actions:**
1. Initialize Vite project: `npm create vite@latest . -- --template react-ts`
2. Install dependencies: `npm install lucide-react reveal.js recharts`
3. Install dev dependencies: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
4. Configure Vitest in `vite.config.ts`
5. Create `src/index.css` with complete CSS custom property tokens from Section 11 of this document
6. Create `src/App.tsx` with the CSS Grid shell layout (sidebar placeholder, main area, bottom bar placeholder)
7. Create `src/App.module.css` with the grid layout

**Verify:** App renders a dark screen with the correct 3-region grid layout.

### Step 2: Mock Data Layer

**Goal:** All TypeScript interfaces and mock data ready for components.

**Actions:**
1. Create `src/data/types.ts` with all interfaces from Section 10
2. Create `src/data/tracks.ts` with 10 mock tracks, 6 mock artists (mix of independent and major-label), 6 mock albums with dominantColor values
3. Create `src/data/playlists.ts` with 6 mock playlists (Discover Weekly, Daily Mix 1-3, Release Radar, Liked Songs)
4. Create `src/data/decisions.ts` with 8 mock AlgorithmDecision records covering all 5 decision types, plus corresponding Explanation records with all 3 detail tiers
5. Create `src/data/fairness.ts` with 2 mock FairnessAudit records and 4 FairnessMetric records (Independent Artist Exposure, Genre Diversity, New Artist Discovery, Engagement Fairness)
6. Create `src/data/interactions.ts` with 20 mock Interaction records across different types
7. Create `src/data/appeals.ts` with 3 mock Appeal records in different statuses
8. Create `src/data/recommendations.ts` with 10 Recommendation composite objects linking tracks to decisions/explanations
9. Create `src/data/glossary.ts` with 8 GlossaryTerm records for: algorithm, algorithmic weight, aggregate monitoring, collaborative filtering, fairness audit, proprietary logic, recommendation signal, transparency

**Verify:** Import each data file in App.tsx and log to console. No TypeScript errors.

### Step 3: Album Art Assets

**Goal:** Visual assets for the mock data.

**Actions:**
1. Create `src/assets/album-covers/` directory
2. Generate or source 6 square placeholder album cover images (300x300px minimum). Use simple gradient or abstract images in colors matching each album's `dominantColor`.
3. A simple approach: create solid-color or gradient SVGs inline in the code rather than external image files. This avoids asset management complexity.

**Verify:** Album art renders in browser.

### Step 4: Spotify Shell -- Sidebar

**Goal:** Left sidebar matching Spotify exactly.

**Actions:**
1. Create `src/components/shell/Sidebar.tsx` and `Sidebar.module.css`
2. Implement nav panel (Home, Search icons from Lucide) with correct dimensions
3. Implement library panel with "Your Library" header and filter chips
4. Implement playlist list rendering mock playlists with thumbnails
5. All hover states: background transitions, text color changes

**Verify:** Sidebar looks like Spotify. Hover states work. Playlist items scroll.

### Step 5: Spotify Shell -- NowPlayingBar

**Goal:** Bottom now-playing bar with simulated playback.

**Actions:**
1. Create `src/hooks/usePlaybackSimulation.ts`
2. Create `src/components/shell/ProgressBar.tsx` and `ProgressBar.module.css`
3. Create `src/components/shell/PlaybackControls.tsx` and `PlaybackControls.module.css`
4. Create `src/components/shell/NowPlayingBar.tsx` and `NowPlayingBar.module.css`
5. Wire up playback simulation in App.tsx
6. Implement all hover states: progress bar green on hover, knob appears, button scale

**Verify:** Now-playing bar shows track info, play/pause toggles, progress bar advances, volume slider works.

### Step 6: Spotify Shell -- TopBar with Tab Switcher

**Goal:** Top bar with functional tab navigation.

**Actions:**
1. Create `src/hooks/useScrollOpacity.ts`
2. Create `src/components/shell/TopBar.tsx` and `TopBar.module.css`
3. Implement tab switcher as centered filter chips (Demo | Presentation | Video | Appendix)
4. Implement back/forward decorative arrows and user avatar
5. Wire up tab state in App.tsx, conditionally render tab content
6. Implement scroll-dependent background opacity

**Verify:** Clicking tabs switches content area. Top bar transitions from transparent to solid on scroll. Active tab is visually indicated.

### Step 7: Demo Page -- Hero + Glossary

**Goal:** Demo page with hero section and expandable glossary.

**Actions:**
1. Create `src/components/demo/DemoPage.tsx` and `DemoPage.module.css`
2. Create `src/components/demo/HeroSection.tsx` and `HeroSection.module.css` -- gradient header
3. Create `src/components/demo/GlossaryPanel.tsx` and `GlossaryPanel.module.css` -- expandable term list
4. DemoPage manages detail level state and glossary expanded state

**Verify:** Hero gradient renders correctly. Glossary toggles open/closed. Terms display with examples.

### Step 8: Demo Page -- Decision Cards + Factor Breakdown

**Goal:** "How Your Recommendations Work" section.

**Actions:**
1. Create `src/components/demo/DecisionCard.tsx` and `DecisionCard.module.css`
2. Create `src/components/demo/FactorBreakdown.tsx` and `FactorBreakdown.module.css`
3. Render 3 DecisionCards in a responsive grid
4. Each card shows explanation at the current detail level
5. FactorBreakdown renders horizontal stacked bar with labels

**Verify:** Three cards render with correct styling. Factor bars show weighted segments. Detail level switch changes explanation text.

### Step 9: Demo Page -- Recommendation List

**Goal:** "Your Recent Recommendations" track list with transparency column.

**Actions:**
1. Create `src/components/demo/RecommendationList.tsx` and `RecommendationList.module.css`
2. Implement Spotify-style track list table with 5 columns
3. Add "Why" column showing top recommendation factor in green
4. Implement row click to expand inline FactorBreakdown
5. All hover states: row highlight, track number -> play icon

**Verify:** Track list looks like Spotify. "Why" column shows transparency info. Rows expand to show full factor breakdown.

### Step 10: Demo Page -- Transparency Controls

**Goal:** User control over explanation detail level.

**Actions:**
1. Create `src/components/demo/TransparencyControls.tsx` and `TransparencyControls.module.css`
2. Implement 3 detail level options as filter chips
3. Implement notification toggle
4. Wire detail level state to DecisionCards and RecommendationList

**Verify:** Switching detail level updates all explanation text across the page.

### Step 11: Demo Page -- Fairness Section

**Goal:** "Fairness & Oversight" section with metrics and aggregate callout.

**Actions:**
1. Create `src/components/demo/FairnessSection.tsx` and `FairnessSection.module.css`
2. Create `src/components/demo/FairnessMetricCard.tsx` and `FairnessMetricCard.module.css`
3. Implement aggregate vs individual callout box
4. Render 4 FairnessMetricCards in a grid
5. Each card shows current value, target, trend, last updated
6. Color coding: green for on-target, orange for below
7. Add "Challenge a Decision" link at section bottom

**Verify:** Metrics display with current + target values. Callout clearly explains aggregate vs individual. Trend indicators show.

### Step 12: Demo Page -- Decision History

**Goal:** Timeline of algorithm decisions.

**Actions:**
1. Create `src/components/demo/DecisionHistory.tsx` and `DecisionHistory.module.css`
2. Implement vertical timeline with connected dots
3. Each entry: timestamp, type badge, description, expandable details
4. Most recent at top

**Verify:** Timeline renders with correct chronological order. Entries expand to show details.

### Step 13: Demo Page -- Appeal Section

**Goal:** Appeal form and process explanation.

**Actions:**
1. Create `src/components/demo/AppealSection.tsx` and `AppealSection.module.css`
2. Implement split layout: form left, process right
3. Form: category dropdown, description textarea, desired outcome dropdown
4. Process: numbered steps with timeline, post-resolution outcomes
5. Previous appeals list below showing mock statuses
6. Form submission shows success confirmation (mock, no actual submission)

**Verify:** Form renders with all fields. Submission shows confirmation. Process steps are clear. Post-appeal outcomes are explained.

### Step 14: Presentation Tab

**Goal:** reveal.js slides embedded in React.

**Actions:**
1. Create `src/components/presentation/PresentationPage.tsx` and `PresentationPage.module.css`
2. Import reveal.js and its CSS
3. Implement mount/unmount lifecycle with useEffect
4. Create placeholder slide structure (10 slides with titles)
5. Apply custom dark Spotify-themed styling to reveal.js

**Verify:** Slides render. Arrow keys navigate. Switching away from tab and back doesn't break reveal.js.

### Step 15: Video Tab

**Goal:** Video player with placeholder state.

**Actions:**
1. Create `src/components/video/VideoPage.tsx` and `VideoPage.module.css`
2. Implement placeholder state (VIDEO_SRC = null)
3. Implement player state with HTML5 video element
4. Style both states in Spotify dark theme

**Verify:** Placeholder state shows "video coming soon" message. Changing VIDEO_SRC to a test video file plays it correctly.

### Step 16: Appendix Tab

**Goal:** Structured appendix with expandable sections.

**Actions:**
1. Create `src/components/appendix/AppendixPage.tsx` and `AppendixPage.module.css`
2. Implement 6 collapsible sections as Spotify-styled cards
3. Each section has placeholder content that group members will fill in
4. Implement expand/collapse with smooth height transition

**Verify:** All 6 sections render. Expand/collapse works smoothly. Content is readable.

### Step 17: Polish and Integration Testing

**Goal:** Final visual polish and integration verification.

**Actions:**
1. Test all tab transitions -- no state leaks, no visual glitches
2. Verify reveal.js mount/unmount doesn't leak DOM nodes
3. Check all hover states and animations across components
4. Verify scroll behavior in Demo page (long content scrolls correctly, TopBar transitions)
5. Check that the NowPlayingBar playback simulation runs continuously across tab switches
6. Cross-browser check in Chrome and Firefox (at minimum)
7. Run `npm run build` and verify the production build works

**Verify:** Complete app runs without console errors. All tabs function. Visual fidelity matches Spotify.

### Step 18: Tests

**Goal:** Test coverage for all components and data.

**Actions:**
1. Write unit tests for each mock data module (valid types, no empty arrays, referential integrity)
2. Write component render tests for all shell components (Sidebar, TopBar, NowPlayingBar)
3. Write component render tests for all Demo sub-components
4. Write interaction tests: tab switching, detail level change, glossary toggle, appeal form submission, row expansion
5. Write hook tests: usePlaybackSimulation advances, useScrollOpacity returns correct range

**Verify:** `npx vitest run` passes all tests.

---

## 14. ADR Summary

The following Architectural Decision Records are filed in `artifacts/design/decisions/`:

| ADR | Title | Decision |
|---|---|---|
| ADR-001 | Tab navigation approach | React state (useState) instead of React Router |
| ADR-002 | Styling methodology | CSS Modules + CSS custom properties instead of Tailwind or CSS-in-JS |
| ADR-003 | Chart library for fairness metrics | Recharts instead of Chart.js or D3 |
| ADR-004 | Explanation detail levels | Three-tier system (basic/detailed/technical) driven by user toggle |

---

## 15. Deployment

**Target:** DigitalOcean droplet

**Build:**
```bash
npm run build
```
Produces a `dist/` folder with static HTML, CSS, JS.

**Serve:**
Nginx config on the droplet serves the `dist/` folder. Single-page app fallback:
```nginx
server {
    listen 80;
    root /var/www/spotify-decision/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

No backend processes needed (D-004).
