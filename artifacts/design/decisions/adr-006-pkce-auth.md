# ADR-006: Client-Side PKCE OAuth for Spotify

## Status
Accepted

## Context
The app needs to authenticate users with their Spotify accounts to fetch personal listening data. Spotify supports three OAuth flows: Authorization Code (requires backend secret), Implicit Grant (deprecated), and Authorization Code with PKCE (client-side, no secret).

## Options Considered

1. **Authorization Code flow (backend)**: Backend stores client secret, handles token exchange. More secure but requires backend auth routes.
2. **Authorization Code with PKCE (client-side)**: No client secret needed. Browser generates a code verifier/challenge pair. Spotify's recommended flow for SPAs.
3. **Implicit Grant**: Simpler but deprecated by Spotify, no refresh tokens, less secure.

## Decision
Option 2: PKCE flow, entirely client-side.

## Rationale
- Spotify explicitly recommends PKCE for single-page applications
- No client secret to protect — eliminates an entire category of security concerns
- Refresh tokens are supported, enabling seamless session continuation
- The Express backend exists only for Claude explanations — keeping auth separate maintains clean separation of concerns
- Tokens stored in sessionStorage (cleared on tab close) rather than localStorage for better security posture

## Consequences
- Client ID is visible in source code — this is acceptable per Spotify's PKCE model (the code challenge replaces the secret)
- Token refresh must be handled in client-side code
- The redirect URI must be registered in the Spotify Developer Dashboard

## References
- D-012 in decision log
- Spotify Authorization Guide: https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
