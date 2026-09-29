# Architecture

```mermaid
flowchart LR
  A[Demo call or transcript] --> B[Scenario adapter]
  B --> C[Voice signal]
  B --> D[Language and intent]
  B --> E[Fraud and social-engineering signals]
  B --> F[Caller, channel, and behaviour signals]
  B --> G[Profile context]
  C --> H[Trust / fraud fusion]
  D --> H
  E --> H
  F --> H
  G --> H
  H --> I[Risk score 0-100]
  I --> J[Evidence-backed explanation]
  J --> K[Continue / verify / block / report]
```

The demo keeps the pipeline modular at the API boundary. The scenario adapter currently provides deterministic synthetic signals. A production implementation can replace those adapters with STT, anti-spoofing, and LLM services without changing the dashboard contract.

The generated API client is derived from `lib/api-spec/openapi.yaml`. The Express implementation lives in `artifacts/api-server/src/routes/bhashashield.ts`; the React surface lives in `artifacts/bhashashield`.