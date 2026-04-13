# Spotify Web Player UI Research

## Executive Summary

This document provides a comprehensive analysis of Spotify's desktop web player UI (open.spotify.com) as of 2025-2026. It covers the complete design system: colors, typography, layout dimensions, component specifications, interactions, animations, icons, and responsive behavior. Values are sourced from Spotify's Encore design system documentation, Spicetify theme API (which exposes Spotify's internal CSS variables), community design analyses, and cross-referenced clone implementations.

**Key finding**: Spotify's UI is a "content-first darkness" paradigm -- the interface recedes into near-black backgrounds so that album art, playlists, and music content can glow. The green accent (#1DB954 / #1ed760) is used sparingly and exclusively for primary actions (play, active states).

---

## 1. Color Palette

### 1.1 Background Colors (Confidence: HIGH)

These are confirmed via Spicetify's `color.ini` which maps directly to Spotify's internal CSS variables:

| Token Name     | Hex       | Usage                                      |
|---------------|-----------|---------------------------------------------|
| `main`        | `#121212` | Primary app background, main content area   |
| `sidebar`     | `#000000` | Left sidebar background                     |
| `player`      | `#181818` | Now Playing bar background (bottom)         |
| `card`        | `#282828` | Card/container surfaces, elevated elements  |
| `shadow`      | `#000000` | Shadow color base                           |

Additional surface colors observed in implementations:

| Hex       | Usage                                          |
|-----------|-------------------------------------------------|
| `#1f1f1f` | Mid-dark surface, subtle elevation              |
| `#252525` | Dark card variant                               |
| `#272727` | Mid card variant                                |
| `#181818` | Top bar background (matches player)             |
| `#242424` | Hover state on sidebar items                    |
| `#1a1a1a` | Activity card background                        |
| `#333333` | Elevated hover state on cards                   |
| `#404040` | Higher-elevation hover (e.g., context menus)    |

### 1.2 Brand / Accent Colors (Confidence: HIGH)

| Token Name       | Hex       | Usage                                   |
|-----------------|-----------|------------------------------------------|
| `button`        | `#1DB954` | Primary button color, brand green        |
| `button-active` | `#1ed760` | Button hover/active state, brighter green|
| --              | `#168f40` | Darker green for pressed states          |
| --              | `#1fdf64` | Brightest green variant (some hover)     |

### 1.3 Text Colors (Confidence: HIGH)

| Token Name | Hex       | Usage                                       |
|-----------|-----------|----------------------------------------------|
| `text`    | `#ffffff` | Primary text (titles, active nav)            |
| `subtext` | `#b3b3b3` | Secondary text (artist names, descriptions)  |
| --        | `#a7a7a7` | Subdued text (timestamps, metadata)          |
| --        | `#cbcbcb` | Near-white text variant                      |
| --        | `#fdfdfd` | Maximum emphasis text                        |
| --        | `#6a6a6a` | Disabled/placeholder text                    |

### 1.4 Interactive State Colors (Confidence: HIGH)

| Hex       | Usage                                          |
|-----------|-------------------------------------------------|
| `#797979` | Selected row highlight (`selected-row` token)   |
| `#ffffff` | Hovered text/icons (from #b3b3b3 default)       |
| `#1ed760` | Active/playing indicator green                  |
| `#333333` | Hovered card background                         |
| `#2a2a2a` | Hovered sidebar item                            |

### 1.5 Semantic Colors (Confidence: MEDIUM)

| Hex       | Usage           |
|-----------|-----------------|
| `#f3727f` | Error red       |
| `#ffa42b` | Warning orange  |
| `#539df5` | Info blue       |

### 1.6 Border Colors (Confidence: MEDIUM)

| Hex       | Usage                   |
|-----------|--------------------------|
| `#4d4d4d` | Border gray              |
| `#7c7c7c` | Light border             |
| `#b3b3b3` | Separator lines          |
| `#333333` | Subtle dividers          |

---

## 2. Typography

### 2.1 Font Family (Confidence: HIGH)

Spotify uses a proprietary typeface called **Spotify Mix** (introduced May 2024, replacing Circular). The web CSS font-family declaration:

```css
font-family: SpotifyMixUI, SpotifyMixUITitle, CircularSp-Arab, CircularSp-Hebr,
             CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva,
             Helvetica Neue, helvetica, arial,
             Hiragino Sans, Hiragino Kaku Gothic ProN,
             Meiryo, MS Gothic, sans-serif;
```

**For our implementation**, since SpotifyMixUI is proprietary and unavailable, use this web-safe fallback:

```css
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
```

This is the closest web-safe approximation -- Spotify Mix is a geometric humanist sans-serif, and Helvetica Neue is the first web-safe font in their own fallback chain.

### 2.2 Font Weights (Confidence: HIGH)

| Weight | Name     | Usage                                          |
|--------|----------|------------------------------------------------|
| 400    | Regular  | Body text, descriptions, playlist names         |
| 600    | Semibold | Secondary emphasis, some headings               |
| 700    | Bold     | Navigation items, headings, song titles, CTAs   |

### 2.3 Font Size Scale (Confidence: HIGH)

| Size   | Usage                                              |
|--------|-----------------------------------------------------|
| 10px   | Smallest labels (e.g., "PREMIUM" badge)             |
| 10.5px | Micro labels                                        |
| 11px   | Timestamps, duration text in track lists            |
| 12px   | Secondary metadata, artist names in now-playing bar |
| 13px   | Navigation sidebar links                            |
| 14px   | Base body text, card descriptions                   |
| 16px   | Default base, larger body text                      |
| 18px   | Section headings ("Made for you", etc.)             |
| 24px   | Page titles, large headings                         |
| 32px   | Hero section titles (playlist/album name)           |
| 48px   | Largest display text (rare, featured content)       |

### 2.4 Line Heights (Confidence: MEDIUM)

| Value  | Usage                           |
|--------|----------------------------------|
| 1.4    | General body text               |
| 1.5    | Relaxed body text               |
| 17px   | Now-playing bar text            |
| 1.1    | Large headings (tight)          |

### 2.5 Letter Spacing (Confidence: HIGH)

| Value       | Usage                                     |
|-------------|-------------------------------------------|
| `normal`    | Default body text                          |
| `-0.35px`   | Global slight tightening (some contexts)   |
| `0.14px`    | Standard slight opening                    |
| `1.4-2px`   | Uppercase labels and button text           |
| `1.5px`     | Section headers / overline labels          |

---

## 3. Layout Dimensions

### 3.1 Overall Structure (Confidence: HIGH)

Spotify's web player uses a three-region layout:

```
+------------------+---------------------------------------+
|                  |          Top Bar (64px)               |
|    Sidebar       +---------------------------------------+
|    (variable)    |                                       |
|                  |          Main Content Area            |
|                  |          (scrollable)                 |
|                  |                                       |
+------------------+---------------------------------------+
|              Now Playing Bar (72-90px)                   |
+---------------------------------------------------------+
```

### 3.2 Sidebar (Confidence: HIGH)

| Property           | Value                                   |
|--------------------|-----------------------------------------|
| Default width      | 280px (resizable by user drag)          |
| Minimum width      | ~72px (collapsed, icons only)           |
| Maximum width      | ~420px (expanded)                       |
| Background         | `#000000`                               |
| Padding top        | 8px                                     |
| Padding horizontal | 8px (outer), items have internal padding|
| Gap between panels | 8px                                     |
| Position           | Fixed left                              |

The sidebar contains two rounded panels:
1. **Navigation panel** (top): Home and Search links
2. **Your Library panel** (below): Playlist/album/artist list

Each panel has:
- Background: `#121212`
- Border-radius: `8px`
- Internal padding: `8px`

### 3.3 Top Bar / Header (Confidence: HIGH)

| Property           | Value                      |
|--------------------|----------------------------|
| Height             | 64px                       |
| Background         | transparent → `#121212` (on scroll, gradient transition) |
| Padding horizontal | 16-24px                    |
| Position           | Sticky top within content area |

Contains: Back/Forward navigation arrows, search bar (when on search page), user avatar/dropdown (right side).

### 3.4 Now Playing Bar (Confidence: HIGH)

| Property           | Value                        |
|--------------------|------------------------------|
| Height             | 72px (current) to 90px       |
| Background         | `#181818`                    |
| Border top         | `1px solid #000`             |
| Padding horizontal | 16px                         |
| Position           | Fixed bottom                 |
| Album art size     | 56px x 56px                  |

Layout is a 3-column flex:
- Left (30%): Album art + track info
- Center (40%): Playback controls + progress bar
- Right (30%): Volume, queue, devices, full-screen

### 3.5 Main Content Area (Confidence: HIGH)

| Property           | Value                                |
|--------------------|--------------------------------------|
| Background         | `#121212`                            |
| Padding horizontal | 24px (desktop), 16px (smaller)       |
| Padding top        | 0 (content scrolls under sticky bar) |
| Scroll behavior    | `overflow-y: auto` on content area   |
| Border-radius      | 8px (top-left, top-right of panel)   |

---

## 4. Component Inventory

### 4.1 Sidebar Components

#### Navigation Panel
- **Home icon + label**: 40px row height, 8px padding, bold 14px text
- **Search icon + label**: Same dimensions
- Active item: White text, bold weight
- Inactive: `#b3b3b3` text, regular weight
- Hover: Background `#1a1a1a`, text brightens to white

#### Your Library Panel
- **Header row**: "Your Library" label + icons (grid/list toggle, "+" create button)
- **Filter chips**: Pill-shaped (border-radius 9999px), `#232323` background, 8px 12px padding
- **Playlist items**: 
  - Row height: 56-64px
  - Thumbnail: 48px x 48px, border-radius 4px (playlists) or 50% (artists)
  - Title: 14px bold white
  - Subtitle: 12px `#b3b3b3`
  - Hover: background `#1a1a1a`

### 4.2 Content Cards (Confidence: HIGH)

Cards appear on Home, Browse, and Search result pages.

| Property            | Value                                    |
|---------------------|------------------------------------------|
| Background          | `#181818`                                |
| Hover background    | `#282828`                                |
| Border-radius       | 8px                                      |
| Padding             | 16px                                     |
| Card width          | Fluid (grid-based, min ~180px)           |
| Image size          | 100% width, square aspect ratio          |
| Image border-radius | 4px (albums/playlists), 50% (artists)    |
| Title               | 14-16px, bold, white, 1-2 lines max     |
| Description         | 12-14px, `#b3b3b3`, 2 lines max, ellipsis|
| Gap between cards   | 16-24px                                  |
| Transition          | `background-color 0.3s ease`             |

#### Card Hover Play Button
- Appears on hover, bottom-right of card image
- Green circle: `#1ed760` background, `#000` icon
- Size: 48px diameter (border-radius: 50%)
- Shadow: `0 8px 8px rgba(0,0,0,0.3)`
- Enters with: `transform: translateY(8px)` -> `translateY(0)`, `opacity: 0` -> `1`
- Transition: `transform 0.3s ease, opacity 0.3s ease`
- Hover on button itself: `transform: scale(1.06)`, background `#1fdf64`

### 4.3 Track List / Table (Confidence: HIGH)

Used on playlist, album, and liked songs pages.

| Property            | Value                                |
|---------------------|--------------------------------------|
| Row height          | 56px                                 |
| Row padding         | 0 16px                               |
| Row hover           | Background `rgba(255,255,255,0.1)`   |
| Row border-radius   | 4px                                  |
| Column layout       | `#` | Title+Artist | Album | Date Added | Duration |
| `#` column width    | 40px                                 |
| Title font          | 16px, white, regular weight          |
| Artist font         | 14px, `#b3b3b3`, regular             |
| Album font          | 14px, `#b3b3b3`, regular             |
| Duration font       | 14px, `#b3b3b3`                      |
| Track number        | 14px, `#b3b3b3`                      |
| On hover: number -> play icon, text -> white        |
| Header row          | 12px uppercase `#b3b3b3`, letter-spacing 1px |
| Divider below header| `1px solid rgba(255,255,255,0.1)`    |

### 4.4 Now Playing Bar Components (Confidence: HIGH)

#### Album Art
- Size: 56px x 56px
- Border-radius: 4px
- On hover: shows expand arrow icon (top-right corner)

#### Track Info
- Song title: 14px (0.875rem), white, bold, link underline on hover
- Artist name: 12px (0.75rem), `#b3b3b3`, link underline on hover
- Heart/save icon: 16px, `#b3b3b3` -> `#1ed760` when saved

#### Playback Controls (center)
- Shuffle icon: 16px, `#b3b3b3` (active: `#1ed760` with dot below)
- Previous track: 16px
- Play/Pause button: 32px circle, white background, black icon
- Next track: 16px
- Repeat icon: 16px, same active behavior as shuffle
- Icons default `#b3b3b3`, hover `#ffffff`
- Active play button hover: `transform: scale(1.06)`

#### Progress Bar
- Track (background): `#4d4d4d`, height 4px, border-radius 2px
- Filled portion: `#ffffff` (default), `#1ed760` (on hover)
- Scrubber knob: 12px circle, white, appears on hover
- Time text: 11px, `#a7a7a7`
- Width: ~40% of viewport (centered section)

#### Volume Slider
- Same styling as progress bar but shorter (~100px wide)
- Volume icon: 16px, `#b3b3b3`

#### Right-side Icons
- Queue, devices, full-screen: 16px each, `#b3b3b3`, hover `#ffffff`

### 4.5 Buttons (Confidence: HIGH)

#### Primary Button (e.g., "Follow", "Play")
- Background: `#1DB954` (or white for "Follow")
- Text: black, bold, 14px, uppercase, letter-spacing 1.5-2px
- Padding: 8px 32px
- Border-radius: 9999px (pill)
- Hover: `transform: scale(1.04)`, slightly brighter
- Transition: `all 0.3s ease`

#### Secondary/Outline Button
- Background: transparent
- Border: 1px solid `#7c7c7c`
- Text: white, bold, 12-14px
- Border-radius: 9999px
- Hover: border color white

#### Circular Play Button (on cards/rows)
- Size: 48px (cards), 56px (page hero), 32px (now-playing bar)
- Background: `#1ed760`
- Icon: black, centered
- Shadow: `0 8px 8px rgba(0,0,0,0.3)`
- Hover: `scale(1.06)`, background `#1fdf64`

### 4.6 Search Bar (Confidence: MEDIUM)

| Property        | Value                          |
|-----------------|--------------------------------|
| Height          | 40-48px                        |
| Background      | `#242424`                      |
| Border-radius   | 500px (pill)                   |
| Padding         | 12px 48px 12px 48px            |
| Placeholder     | 14px, `#b3b3b3`               |
| Text color      | white                          |
| Focus border    | `2px solid #ffffff`            |
| Search icon     | 24px, left-positioned          |

---

## 5. Navigation Pattern (Confidence: HIGH)

### URL Routing
Spotify uses client-side routing with paths like:
- `/` -- Home
- `/search` -- Search
- `/search/{query}` -- Search results
- `/playlist/{id}` -- Playlist view
- `/album/{id}` -- Album view
- `/artist/{id}` -- Artist view
- `/collection/tracks` -- Liked Songs
- `/genre/{id}` -- Genre/category browse

### Navigation Behavior
- Sidebar nav items (Home, Search) navigate via client-side routing
- Back/Forward buttons in top bar function as browser history
- Content transitions: instant swap, no page-level animations
- Scroll position resets on navigation
- Top bar background fades from transparent to `#121212` as user scrolls down (opacity transition)

---

## 6. Icons (Confidence: HIGH)

### Icon System
Spotify uses **custom SVG icons** -- not a public icon set. They are inline SVGs rendered at specific sizes.

### Key Icon Sizes
| Context              | Size   |
|---------------------|--------|
| Sidebar navigation  | 24px   |
| Playback controls   | 16px   |
| Play/Pause (player) | 16px (inside 32px button) |
| Card play button    | 24px (inside 48px circle) |
| Top bar nav arrows  | 16px   |
| Heart/save          | 16px   |
| Volume/queue/devices| 16px   |

### Icon Colors
- Default: `#b3b3b3`
- Hover: `#ffffff`
- Active: `#1ed760` (shuffle, repeat when active)
- Play button icon: `#000000` (on white/green circle)

### Recommended Substitute
For implementation, use **Lucide React** or **react-icons** with custom SVGs for the most Spotify-like appearance. Key icons needed:
- Home (filled + outline), Search (magnifier), Library (stack)
- Play, Pause, Skip Forward, Skip Back, Shuffle, Repeat
- Heart (outline + filled), Plus (add to playlist)
- Volume (2, 1, X variants), Queue (list), Devices (computer/speaker)
- ChevronLeft, ChevronRight (navigation)
- User (avatar), Dots (more menu), Clock (recently played)

---

## 7. Hover & Active States (Confidence: HIGH)

### Cards
- Background: `#181818` -> `#282828` on hover
- Play button slides up from behind card image (translateY animation)
- Transition: `background-color 0.3s ease`

### Sidebar Items
- Background: transparent -> `rgba(255,255,255,0.1)` on hover
- Text: `#b3b3b3` -> `#ffffff` on hover

### Track List Rows
- Background: transparent -> `rgba(255,255,255,0.1)` on hover
- Track number replaced by play icon on hover
- Text color brightens on hover
- Currently playing row: `#1ed760` on track title

### Text Links
- Default: regular weight, no underline
- Hover: underline appears
- Artist/album links in descriptions

### Buttons
- Primary: `scale(1.04)` on hover
- Play circle: `scale(1.06)` on hover
- Icon buttons: color `#b3b3b3` -> `#ffffff`

### Progress/Volume Bars
- Track color stays `#4d4d4d`
- Fill changes from `#ffffff` to `#1ed760` on hover
- Scrubber knob (12px circle) appears on hover

---

## 8. Animations & Transitions (Confidence: MEDIUM)

### Transition Durations
| Duration | Usage                                      |
|----------|--------------------------------------------|
| 0ms      | Instant state changes (text color in some)  |
| 100ms    | Micro-interactions (icon color change)      |
| 200ms    | Button press feedback                       |
| 300ms    | Standard transitions (card hover, play btn) |
| 350ms    | Navigation/slide transitions                |

### Easing Functions
| Easing              | Usage                       |
|---------------------|-----------------------------|
| `ease`              | Default for most transitions|
| `ease-in-out`       | Smooth bidirectional        |
| `ease-out`          | Exit animations             |
| `cubic-bezier(0.3, 0, 0, 1)` | Spring-like motion |
| `linear`            | Progress bar scrubbing      |

### What Animates
- Card background color on hover
- Play button opacity + translateY on card hover
- Scale on button hover
- Top bar background opacity on scroll
- Sidebar resize (width transition)
- Progress bar fill (scrubbing is linear, no ease)
- Page scroll (native smooth)

### What Does NOT Animate
- Page content swaps (instant)
- Track list rows (instant highlight)
- Sidebar navigation selection (instant)
- Text color changes (instant or very fast ~100ms)

---

## 9. Responsive Behavior (Confidence: HIGH)

### Breakpoints

| Name          | Range          | Behavior                               |
|---------------|----------------|----------------------------------------|
| Mobile Small  | < 425px        | Single column, no sidebar              |
| Mobile        | 425-576px      | Single column                          |
| Tablet        | 576-768px      | Sidebar collapses to icons, 2-col grid |
| Tablet Large  | 768-896px      | Sidebar narrow, 3-col grid             |
| Desktop Small | 896-1024px     | Full sidebar, 3-4 col grid             |
| Desktop       | 1024-1280px    | Full layout, 4-5 col grid              |
| Large Desktop | > 1280px       | Full layout, 5-7 col grid              |

### Sidebar Responsive Behavior
- **Full**: Shows icons + text labels + playlist list (280px+)
- **Narrow**: Shows icons + text, shortened playlist list (~200px)
- **Collapsed**: Shows only icons (~72px)
- **Hidden**: Below tablet breakpoint, sidebar becomes overlay

### Card Grid Responsive
- Uses CSS Grid with `auto-fill` and `minmax(180px, 1fr)`
- Columns reduce as viewport shrinks
- Below mobile: single column stack

### Now Playing Bar
- Desktop: Full 3-column layout
- Tablet: Center controls prioritized, side sections compress
- Mobile: Simplified bar with just album art, title, play/pause

---

## 10. Dark Theme Details (Confidence: HIGH)

Spotify is always dark. There is no light mode for the web player. However, there are **subtle background variations** that create visual hierarchy:

### Background Hierarchy (darkest to lightest)

1. `#000000` -- Sidebar outer background (deepest layer)
2. `#0e0e0e` -- Occasional deep background
3. `#121212` -- Main content background, sidebar panel fill
4. `#181818` -- Now playing bar, top bar (scrolled), card default
5. `#1a1a1a` -- Hover states on sidebar items
6. `#1f1f1f` -- Mid-dark surface
7. `#242424` -- Search bar background, input fields
8. `#252525` -- Slightly elevated cards
9. `#272727` -- Mid card surfaces
10. `#282828` -- Card hover, elevated surfaces
11. `#333333` -- Higher elevation (dropdown menus, tooltips)
12. `#404040` -- Highest elevation (active dropdowns)

### Gradient Effects
- **Page header**: Album/playlist pages have a gradient from album art's dominant color fading down into `#121212` (approximately 300-400px tall)
- **Top bar scroll**: Fades from `transparent` to the header gradient color, then to `#121212`
- **Sidebar gradient**: None (flat color panels)

### Album Art Color Extraction
- Spotify extracts the dominant color from album art
- This color tints the top ~30% of playlist/album pages
- The gradient: `dominant-color` at top -> `#121212` at ~400px
- This is the primary source of color in the UI

---

## 11. Design Tokens (CSS Variables)

The following CSS custom properties can be used to build a faithful replica:

```css
:root {
  /* Backgrounds */
  --bg-base: #121212;
  --bg-sidebar: #000000;
  --bg-sidebar-panel: #121212;
  --bg-player: #181818;
  --bg-card: #181818;
  --bg-card-hover: #282828;
  --bg-elevated: #282828;
  --bg-elevated-hover: #333333;
  --bg-highlight: rgba(255, 255, 255, 0.1);
  --bg-input: #242424;
  --bg-tooltip: #282828;

  /* Brand */
  --color-green: #1DB954;
  --color-green-light: #1ed760;
  --color-green-bright: #1fdf64;
  --color-green-dark: #168f40;

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #b3b3b3;
  --text-subdued: #a7a7a7;
  --text-disabled: #6a6a6a;

  /* Interactive */
  --icon-default: #b3b3b3;
  --icon-hover: #ffffff;
  --icon-active: #1ed760;
  --selected-row: #797979;

  /* Borders */
  --border-default: #4d4d4d;
  --border-light: #7c7c7c;
  --border-separator: rgba(255, 255, 255, 0.1);

  /* Semantic */
  --color-error: #f3727f;
  --color-warning: #ffa42b;
  --color-info: #539df5;

  /* Shadows */
  --shadow-heavy: 0px 8px 24px rgba(0, 0, 0, 0.5);
  --shadow-medium: 0px 8px 8px rgba(0, 0, 0, 0.3);
  --shadow-play-button: 0px 8px 8px rgba(0, 0, 0, 0.3);

  /* Typography */
  --font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;
  --font-size-3xl: 48px;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing (8px base) */
  --spacing-xxs: 2px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-base: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-pill: 9999px;
  --radius-circle: 50%;

  /* Layout */
  --sidebar-width: 280px;
  --sidebar-collapsed-width: 72px;
  --topbar-height: 64px;
  --player-height: 72px;
  --card-min-width: 180px;

  /* Transitions */
  --transition-fast: 100ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 350ms ease;
}
```

---

## 12. Key Component Patterns for Implementation

### Sidebar Panel Pattern
```
Container: bg #000, padding 8px, flex column, gap 8px
  Panel 1 (nav): bg #121212, border-radius 8px, padding 8px
    NavItem: height 40px, padding 0 12px, flex, align-center, gap 16px
  Panel 2 (library): bg #121212, border-radius 8px, padding 8px, flex-grow 1
    Header: flex, justify-between, padding 8px 8px 0
    FilterChips: flex, gap 8px, padding 8px
    PlaylistList: overflow-y auto, flex-grow 1
      PlaylistItem: height 56px, flex, align-center, padding 8px, gap 12px
```

### Content Card Grid
```
Grid container: display grid, grid-template-columns repeat(auto-fill, minmax(180px, 1fr)), gap 24px
  Card: bg #181818, border-radius 8px, padding 16px, cursor pointer
    Image: width 100%, aspect-ratio 1, border-radius 4px (or 50% for artists), position relative
      PlayButton (hidden by default): position absolute, bottom 8px, right 8px
    Title: 14px bold white, margin-top 8px, line-clamp 1
    Description: 12px #b3b3b3, margin-top 4px, line-clamp 2
```

### Track List Row
```
Row: display grid, grid-template-columns [40px] [minmax(120px,4fr)] [minmax(120px,2fr)] [minmax(120px,1fr)] [60px]
     height 56px, padding 0 16px, align-items center, border-radius 4px
  #/Play: 14px #b3b3b3, text-align right
  Title+Artist: flex column
    Title: 16px white
    Artist: 14px #b3b3b3 (link)
  Album: 14px #b3b3b3 (link)
  Date: 14px #b3b3b3
  Duration: 14px #b3b3b3, text-align right
```

---

## 13. Confidence Assessment Summary

| Section                | Confidence | Notes                                           |
|-----------------------|------------|--------------------------------------------------|
| Background colors     | HIGH       | Confirmed via Spicetify tokens + multiple sources|
| Brand/accent colors   | HIGH       | Consistent across all sources                    |
| Text colors           | HIGH       | Confirmed via Spicetify + design system docs     |
| Font family           | HIGH       | Official announcement + CSS inspection           |
| Font sizes            | HIGH       | Confirmed across multiple sources                |
| Font weights          | HIGH       | Consistent across sources                        |
| Sidebar dimensions    | HIGH       | Multiple sources agree, user-resizable           |
| Top bar height        | HIGH       | Consistent at 64px across sources                |
| Now playing bar       | HIGH       | 72-90px range, 72px most current                 |
| Card styling          | HIGH       | Very well documented across clones               |
| Track list            | HIGH       | Well documented                                  |
| Hover/active states   | HIGH       | Consistent patterns across sources               |
| Animation durations   | MEDIUM     | Estimated from clones, not from source           |
| Easing functions      | MEDIUM     | Standard CSS easings, cubic-bezier estimated      |
| Responsive breakpoints| MEDIUM     | From design system doc, may not be exact          |
| Icon specifics        | HIGH       | Custom SVGs, sizes well documented               |
| Gradient behavior     | MEDIUM     | Observed but exact implementation unclear         |

## 14. Gaps and Unknowns

1. **Exact SpotifyMixUI font metrics**: Since the font is proprietary, kerning, x-height, and precise metrics cannot be replicated. Helvetica Neue is the closest practical substitute.
2. **Exact easing curves**: Spotify likely uses custom cubic-bezier curves in their Encore system, but specific values are not publicly documented. Standard `ease` and `ease-in-out` are close approximations.
3. **Context menu styling**: Dropdown menus, right-click menus, and modal dialogs were not fully documented in available sources.
4. **Scroll bar styling**: Spotify uses custom thin scrollbars (likely `::-webkit-scrollbar` with ~8px width, `#ffffff33` thumb).
5. **Keyboard shortcut indicators**: Unknown if/how these appear in UI.
6. **Exact gradient algorithm**: How Spotify extracts dominant color from album art and generates the page header gradient is proprietary.

---

## Sources

- [Spotify Design System Tokens (awesome-design-systems)](https://github.com/aaldere1/awesome-design-systems/blob/main/references/spotify.md)
- [Recreate Spotify Part 1 (DEV Community)](https://dev.to/tsanak/recreate-spotify-part-1-141)
- [Recreate Spotify Part 5 - Bottom Bar (DEV Community)](https://dev.to/tsanak/recreate-spotify-part-5-bottom-bar-462h)
- [Spicetify Themes Documentation](https://spicetify.app/docs/customization/themes)
- [Spotify Encore Design System (spotify.design)](https://spotify.design/article/reimagining-design-systems-at-spotify)
- [Spotify Mix Font Announcement](https://newsroom.spotify.com/2024-05-22/introducing-spotify-mix-our-new-and-exclusive-font/)
- [What Font Does Spotify Use 2026 (SensaType)](https://sensatype.com/what-font-does-spotify-use-in-2026)
- [Spotify Brand Colors (US Brand Colors)](https://usbrandcolors.com/spotify-colors/)
- [Spotify UI Clone (CodeByAlmas)](https://github.com/CodeByAlmas/pure-html-css-spotify-clone)
- [Spotify Grid Layout (CodePen/Gist)](https://gist.github.com/Quincy2002/47bf225143b6651146241e8cce122b1b)
- [Spotify Button CSS (TutorialPedia)](https://www.tutorialpedia.org/blog/spotify-button-css/)
- [Figma - Spotify Design System (Figma Community)](https://www.figma.com/community/file/1341046779467323710/spotify-player-card)
