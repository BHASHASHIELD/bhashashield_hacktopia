# BhashaShield 2.0

BhashaShield turns voice-fraud signals, caller trust, conversation intent, behaviour, and profile context into an explainable safety recommendation.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/bhashashield run dev` — run the web dashboard
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Storage: synthetic in-memory demo state; no raw audio is persisted
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/bhashashield/src/pages/workspace.tsx` — primary analysis workspace
- `artifacts/bhashashield/src/pages/trusted.tsx` — trusted people
- `artifacts/bhashashield/src/pages/directory.tsx` — independent verification directory
- `artifacts/api-server/src/routes/bhashashield.ts` — synthetic demo analysis engine and API
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `docs/` — architecture, privacy, demo, API, evaluation, and experiment notes

## Architecture decisions

- Demo scenarios are synthetic and intentionally deterministic so a hackathon walkthrough is reproducible.
- Risk is fused from several signals; no single signal such as a synthetic voice, OTP request, or unknown number decides fraud alone.
- Verified directory matching uses exact stored numbers and supports independent verification; number prefixes are never trusted.
- Transcript content returned to the UI is redacted before the analysis response is persisted in the demo history.
- Full STT, anti-spoofing models, LLM reasoning, and durable seven-day retention are extension points, not silently mocked as production integrations.

## Product

- Switch between seven synthetic call scenarios and run real API-backed analyses.
- Review a risk score, level, confidence, evidence, transcript, language, intent, context, behaviour, and recommended action.
- Record feedback without retaining raw audio.
- Add trusted people and use saved contact context for verification.
- Search the synthetic verified directory and check exact institutional numbers.
- Show offline / limited analysis and privacy cues in the interface.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The directory entries are explicitly labelled synthetic demo data and are not a source of official contact information.
- The demo API keeps state in memory; restarting the API resets added trusted people and analysis history.
- Run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
