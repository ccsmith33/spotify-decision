# ADR-003: Chart Library for Fairness Metrics

## Status
Decided

## Context
The fairness section displays metric visualizations: horizontal bars showing current vs target values, and potentially trend charts. We need a charting approach that renders inside React components and can be styled to match Spotify's dark theme.

## Options Considered

### Option A: D3.js
- Most powerful and flexible
- Direct SVG/Canvas manipulation
- Steep learning curve, verbose API
- Does not integrate naturally with React's component model (imperative vs declarative)
- Overkill for the simple visualizations needed

### Option B: Chart.js (via react-chartjs-2)
- Canvas-based, good performance
- Pre-built chart types
- Customization of individual bar colors/styles is more complex
- Canvas rendering doesn't integrate well with CSS custom properties

### Option C: Recharts
- Built specifically for React (declarative component API)
- SVG-based (styleable with CSS, supports custom properties)
- Lightweight tree-shakeable imports
- BarChart, ResponsiveContainer components fit the fairness metrics layout exactly
- Active maintenance, good TypeScript support

### Option D: Pure CSS/SVG
- No dependency
- Hand-code horizontal bars with div widths
- Sufficient for simple current-vs-target bars
- No built-in animation or interaction patterns

## Decision
**Option C: Recharts** for the fairness metrics dashboard. **Option D: Pure CSS** for the simpler FactorBreakdown stacked bars.

## Rationale
- Recharts provides the right abstraction level: declarative, React-native, SVG-based. The fairness metric cards benefit from Recharts' responsive containers, tooltips, and reference lines (for target markers).
- The FactorBreakdown component (showing algorithm factor weights as a stacked horizontal bar) is simple enough that a CSS flexbox implementation with percentage widths is cleaner than pulling in a chart library.
- This split avoids both over-engineering (D3 for simple bars) and under-engineering (pure CSS for metrics that benefit from chart features like reference lines and tooltips).

## Consequences
- Recharts adds ~40KB to the bundle (tree-shaken). Acceptable for a presentation app.
- Two different visualization approaches in the codebase (Recharts for fairness, CSS for factors). Justified by the complexity difference.
- Recharts SVG elements can be styled to match Spotify's dark theme via custom colors in the component props.
