# API

The API is mounted under `/api`.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/healthz` | Health check |
| GET | `/dashboard` | Seeded overview metrics and recent decisions |
| GET | `/demo-scenarios` | Synthetic guided scenarios |
| POST | `/analyze` | Run a structured multi-signal analysis |
| POST | `/feedback` | Record explicit outcome feedback |
| GET | `/trusted-people` | List trusted contacts |
| POST | `/trusted-people` | Add a trusted contact |
| GET | `/directory` | List synthetic directory entries |
| POST | `/directory/verify` | Exact institutional number comparison |

`POST /analyze` requires `scenarioId` and `userId`. Optional fields include `callerNumber`, `transcript`, `voiceClass`, and `offline`.