# ADR-002: Styling Methodology

## Status
Decided

## Context
The app must replicate Spotify's UI with pixel-level fidelity. The Spotify UI research document provides 50+ design tokens (colors, spacing, typography, dimensions) that must be consistently applied across all components. We need a CSS strategy that supports both global consistency and component-level scoping.

## Options Considered

### Option A: Tailwind CSS
- Utility-first, rapid prototyping
- Custom theme config maps to Spotify tokens
- Long class strings in JSX reduce readability
- Large dependency, utility classes don't map 1:1 to Spotify's specific values (e.g., `#181818` needs a custom color)

### Option B: CSS-in-JS (styled-components / emotion)
- Co-located styles with components
- Dynamic styling via props
- Runtime overhead (style injection)
- TypeScript integration is good but adds bundle size

### Option C: CSS Modules + CSS Custom Properties
- CSS Modules provide component-scoped class names (compiled at build time, zero runtime)
- CSS custom properties (`:root` variables) provide global design token consistency
- Vite has built-in CSS Module support (no config needed for `*.module.css`)
- Standard CSS -- no learning curve beyond CSS itself
- Co-located with components (`Component.module.css` next to `Component.tsx`)

## Decision
**Option C: CSS Modules + CSS Custom Properties**

## Rationale
- **Token consistency**: All Spotify design tokens are defined once in `index.css` as CSS custom properties. Every component references `var(--bg-card)` instead of `#181818`. Changing a token value updates the entire app.
- **Zero runtime cost**: CSS Modules are compiled at build time by Vite. No style injection, no bundle size increase.
- **Scoping**: CSS Module class names are automatically hashed, preventing collisions. Each component's styles are isolated.
- **Simplicity**: For a project built by a single developer (D-002), the overhead of Tailwind config or CSS-in-JS libraries is not justified. Standard CSS is the simplest approach that meets the requirements.
- **Fidelity**: Spotify's own UI uses standard CSS with custom properties (via their Encore design system). Mirroring this approach maximizes fidelity.

## Consequences
- No utility classes -- all styles are written as traditional CSS. This is more verbose than Tailwind but more readable.
- Dynamic styles (e.g., progress bar width, gradient colors) use inline `style` attributes in JSX, referencing token values.
- TypeScript type safety for class names requires importing the module: `import styles from './Component.module.css'`.
