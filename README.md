# BhashaShield 2.0

Context-aware voice-fraud protection for multilingual, social-engineering-heavy calls.

## What it demonstrates

BhashaShield does not treat a deepfake signal, an OTP request, an unknown number, or a government-scheme mention as fraud on its own. It combines voice authenticity, intent, caller trust, channel verification, behaviour, and personalized context into one explainable recommendation.

The current build is a synthetic hackathon demo with:

- seven guided call scenarios, including safe family, human scam, AI impersonation, government scheme scam, legitimate scheme interaction, bank impersonation, and trusted-person impersonation
- Hindi, English, and Hinglish transcript examples
- structured, multi-signal risk scoring from 0–100
- redacted transcript output
- trusted-person management
- exact-number independent directory verification
- explicit offline / limited analysis language
- feedback capture without raw voice storage

## Run

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/bhashashield run dev
```

Open the project preview. The dashboard is served at the root route and the API is served under `/api`.

## Implementation status

**IMPLEMENTED**

- React + Vite dashboard and responsive navigation
- OpenAPI contract and generated React Query/Zod clients
- Express API for scenarios, analysis, feedback, trusted people, and directory verification
- deterministic demo fusion engine with evidence and recommendations
- sensitive transcript redaction before returning results

**PARTIAL**

- Voice authenticity, multilingual STT, LLM intent analysis, and offline analysis are represented by deterministic demo signals. They are intentionally not presented as validated model results.
- Demo state is in memory and resets when the API restarts.

**NOT IMPLEMENTED**

- live telephony integration
- WAV/MP3/M4A ingestion
- production-grade anti-spoofing/STT models
- durable retention database and scheduled seven-day deletion
- official directory synchronization

See `docs/PRIVACY.md` and `docs/EVALUATION.md` for the boundaries.