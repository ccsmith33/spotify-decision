# ADR-005: Express Backend Replaces Nginx

## Status
Accepted

## Context
The v1 deployment uses nginx to serve the Vite static build. We now need a backend endpoint (`POST /api/explain`) that shells out to the Claude Code CLI (`claude -p`) to generate recommendation explanations. The user has a Claude Code subscription and will authenticate the CLI on the droplet — no Anthropic SDK or API key is involved. We need a way to serve both static files and this API from a single process on port 80.

## Options Considered

1. **Keep nginx + add a separate API process**: nginx serves static files and reverse-proxies `/api/*` to a Node process on a different port.
2. **Express serves everything**: A single Express process serves `dist/` as static files and handles `/api/explain` via `child_process.execFile('claude', ['-p', prompt])`.
3. **Serverless function**: Deploy the explain endpoint as a cloud function (AWS Lambda, Cloudflare Worker).
4. **Use Anthropic SDK directly**: Import `@anthropic-ai/sdk` and call the Messages API with an API key.

## Decision
Option 2: Express serves everything, using the Claude Code CLI.

## Rationale
- Simplest deployment: one process, one port, no reverse-proxy configuration
- The Claude Code CLI must run on a machine where it is installed and authenticated — serverless is not viable
- No API key to manage or secure — the CLI handles its own auth via the user's Claude Code subscription
- The `@anthropic-ai/sdk` package is explicitly **not used** — `child_process.execFile` with `claude -p` is the integration point
- nginx adds configuration complexity for a single API route with no load-balancing needs
- Express's `express.static()` is sufficient for serving a Vite build

## Consequences
- Must install Node.js on the droplet (may already be present for build step)
- Must install Claude Code CLI on the droplet and authenticate it before starting the server
- Should use pm2 or systemd for process management
- No nginx caching layer, but the app is lightweight enough that this does not matter
- Each explanation request spawns a `claude` process (acceptable for demo-scale traffic)

## References
- D-011 in decision log
