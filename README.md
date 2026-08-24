# incident-pilot-dashboard

Read-only visualization layer over two backends:

- **incident-pilot-ecommerce** (Observation Gateway) — incidents, evidence,
  topology, per-source status. Already built and live-tested.
- **incident-pilot-agent** (Intelligence Plane) — root cause, confidence,
  verification. Its read API doesn't exist yet; see Phase 2 below.

This app does not investigate, remediate, or write to either backend. All
backend calls happen server-side (Next.js route handlers under `app/api/`);
the browser only ever talks to this app's own `/api/*` routes, so
`GATEWAY_API_KEY` never reaches client code.

## Setup

```bash
npm install
cp .env.example .env.local
# fill in GATEWAY_URL / GATEWAY_API_KEY in .env.local
npm run dev
```

Point `GATEWAY_URL` at a `kubectl port-forward` of the Observation Gateway
(same pattern used elsewhere in this project), e.g.:

```bash
kubectl port-forward -n observability svc/observation-gateway 8000:8000
```

then `GATEWAY_URL=http://localhost:8000`.

## Status vocabulary note

The Gateway's `Incident.status` field is `open | resolved | closed`
(`shared/models/incident.py` in incident-pilot-ecommerce) — there is no
"Investigating"/"Confirmed"/"Escalated" incident status anywhere in either
backend today. Badges, filters, and stat cards use the real Gateway values.
"Confirmed"/"Rejected" *does* exist, but only as the agent's per-hypothesis
verification verdict (Phase 2) — see the root-cause card.

## Phasing

- **Phase 1 (current):** list, filters, stat cards, incident detail,
  evidence, topology, timeline, and source-status wired to the Gateway's
  existing endpoints. The root-cause card renders an honest empty state via
  `getInvestigation()` in `lib/investigation.ts`, which always returns
  `null` until `AGENT_API_URL` is set.
- **Phase 2:** once incident-pilot-agent exposes
  `GET /investigations/{incident_id}`, implement the real fetch inside
  `getInvestigation()`. Every caller already expects `Investigation | null`
  (see `types/index.ts`), so this is a one-function change.

## Not built (by design)

- No remediation execution — UI placeholder only (`RemediationPlaceholder`).
- No assignment backend — UI placeholder only (`AssigneePlaceholder`).
- No writes to the Gateway or agent API anywhere.
- No auth/login — internal tool, not exposed beyond a local/internal
  network. Needs a decision before wider exposure.
- No polling/auto-refresh — manual refresh button only.

## Deployment

Run locally (`npm run dev`) against a port-forwarded Gateway, same as the
rest of this project. Do not deploy this to the constrained EC2 cluster box
— containerization/deployment is a separate, later task.
