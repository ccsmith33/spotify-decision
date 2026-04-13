# ADR-004: Explanation Detail Levels

## Status
Decided

## Context
User testing revealed a significant comprehension gap between user types. Power users (P1, confidence 5.0) understood algorithmic explanations immediately, while casual users (P3, confidence 2.5) struggled with terminology like "proprietary ranking logic" and "aggregate-level monitoring." The portal must serve both audiences without dumbing down content for experts or overwhelming casual users.

The data model includes an Explanation entity that stores "different levels of explanations without exposing proprietary algorithm details." This needs a concrete implementation strategy.

## Options Considered

### Option A: Single explanation level
- One explanation text per decision
- Simplest implementation
- Cannot address the user testing finding that casual and power users have fundamentally different needs

### Option B: Two levels (Simple / Detailed)
- Binary toggle
- Better than one level
- Doesn't fully address the range: P3 needed very plain language, P1 wanted technical depth, P2 was in between

### Option C: Three levels (Basic / Detailed / Technical)
- Maps directly to the three user testing participant profiles
- Basic: Flesch-Kincaid grade 8 or below, no jargon, concrete examples (addresses P3's needs)
- Detailed: Moderate depth, explains concepts without requiring background knowledge (addresses P2's needs)
- Technical: Full transparency with algorithm terminology, factor weights, confidence scores (addresses P1's needs)
- User selects via a persistent toggle control

## Decision
**Option C: Three levels (Basic / Detailed / Technical)**

## Rationale
- The three levels map directly to the three user profiles observed in testing: casual (P3), music-discovery-focused (P2), and power user (P1).
- The Explanation data model entity already has `basic`, `detailed`, and `technical` fields, making this a natural fit.
- A user-controlled toggle respects user agency -- the same approach Spotify uses for other preference settings.
- The toggle is persistent within a session (stored in React state). Changing the level updates all explanation content on the page simultaneously, providing a consistent experience.
- This directly addresses User Testing Action 1 (terminology barrier) by providing a level where no technical terms appear.

## Consequences
- Mock data must include three explanation texts for every AlgorithmDecision. This triples the explanation content but ensures the feature is demonstrable.
- The TransparencyControls component must be visible early on the Demo page so users discover the toggle before reading explanations.
- DecisionCard, RecommendationList, and DecisionHistory components all receive the current detail level as a prop and render the corresponding explanation text.
- The GlossaryPanel provides a complementary approach: even at the "basic" level, users can expand the glossary for additional context.
