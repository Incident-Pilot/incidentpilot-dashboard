# incident-pilot-dashboard

Read-mostly visualization layer over two backends:

- **incident-pilot-ecommerce** (Observation Gateway) — incidents, evidence,
  topology, per-source status. Already built and live-tested.
- **incident-pilot-agent** (Intelligence Plane / `agentic_layer` watch
  service) — root cause, confidence, verification, and on-demand
  investigation triggering.

This app does not write to the Gateway. It does call the Agent API to
*trigger* investigations (see below), and to resolve/cancel incidents via the
Gateway's status endpoint. All backend calls happen server-side (Next.js
route handlers under `app/api/`); the browser only ever talks to this app's
own `/api/*` routes, so `GATEWAY_API_KEY` / `AGENT_API_KEY` never reach
client code.

## Setup

```bash
npm install
cp .env.example .env.local
# fill in the values described below in .env.local
npm run dev
```

Point `GATEWAY_URL` (and `AGENT_API_URL`, if you're testing investigations)
at a `kubectl port-forward` of the relevant service, e.g.:

```bash
kubectl port-forward -n observability svc/observation-gateway 8000:8000
kubectl port-forward -n <namespace> svc/agent-service 8100:8100
```

then `GATEWAY_URL=http://localhost:8000` and `AGENT_API_URL=http://localhost:8100`.

### Environment variables

See `.env.example` for the full annotated list. Summary:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GATEWAY_URL` | Yes | Observation Gateway base URL (incidents, evidence, topology, source status). |
| `GATEWAY_API_KEY` | Yes | Bearer token for the Gateway. |
| `AGENT_API_URL` | Only for investigations | Agent API base URL. Without it, the root-cause card renders an honest empty state instead of erroring, and the "Investigate" button fails with a 500. |
| `AGENT_API_KEY` | Only for investigations | Bearer token for the Agent API (required on every route except `/health`). |
| `DASHBOARD_USERNAME` | Yes | Single hardcoded login username (no user table, no OAuth). |
| `DASHBOARD_PASSWORD_HASH` | Yes | bcrypt hash of the login password — generate with `node -e "console.log(require('bcryptjs').hashSync('your-chosen-password', 12))"`. Never store the plaintext password. |
| `SESSION_SECRET` | Yes | Random 32+ byte secret (e.g. `openssl rand -base64 32`) used by `iron-session` to sign/encrypt the session cookie. Rotating it invalidates all sessions. |

## Auth

Single-user login, protected by `proxy.ts` (Next.js 16's renamed
`middleware.ts` — see `AGENTS.md`). Every route requires a valid session
cookie except `/login` and `/api/login`; unauthenticated API requests get a
`401`, unauthenticated page requests get redirected to `/login`. There's no
user table — just one hardcoded username/password-hash pair via
`DASHBOARD_USERNAME` / `DASHBOARD_PASSWORD_HASH`.

## Status vocabulary note

The Gateway's `Incident.status` field is `open | resolved | closed`
(`shared/models/incident.py` in incident-pilot-ecommerce) — there is no
"Investigating"/"Confirmed"/"Escalated" incident status anywhere in either
backend. Badges, filters, and stat cards use the real Gateway values.
"Confirmed"/"Rejected" *does* exist, but only as the agent's per-hypothesis
verification verdict — see the root-cause card.

## Investigations

The "Investigate" button (`app/api/incidents/[id]/investigate/route.ts`)
triggers a new investigation by calling `POST /investigations/{incident_id}`
on the Agent API — this starts the investigation as a background task on
that service; the dashboard does not run or manage the investigation
process itself. Reading a completed investigation's root cause and
verification data goes through `getInvestigation()` in
`lib/investigation.ts`, which calls `GET /investigations/{incident_id}` and
returns `null` (not an error) when `AGENT_API_URL` is unset or the agent
hasn't produced a result yet — every caller already expects
`Investigation | null` (see `types/index.ts`).

## Not built (by design)

- No remediation execution — UI placeholder only (`RemediationPlaceholder`).
- No assignment backend — UI placeholder only (`AssigneePlaceholder`).
- No writes to the Gateway other than incident status (resolve/cancel).
- No polling/auto-refresh — manual refresh button only.

## Project structure

```
app/
  api/                  Server-side route handlers (proxy to Gateway/Agent API)
  login/                Login page
  page.tsx              Incident list / dashboard
components/
  badges/               Status/severity/source-status indicators
  incident/             Incident detail panel, evidence, topology, timeline, root cause, remediation
  layout/                Filter bar, stat cards, logout button
lib/
  gateway.ts            Server-only Gateway API client
  investigation.ts       Server-only Agent API client (read)
  auth.ts / session.ts   Login + iron-session helpers
proxy.ts                Auth middleware (Next.js 16's middleware.ts rename)
types/                  Shared TypeScript types (Incident, Investigation, etc.)
```

## Deployment

Run locally (`npm run dev`) against port-forwarded Gateway/Agent services,
same as the rest of this project. Do not deploy this to the constrained EC2
cluster box — containerization/deployment is a separate, later task.
