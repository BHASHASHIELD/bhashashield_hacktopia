# Evaluation

No model accuracy, precision, recall, F1, deepfake benchmark, or offline benchmark is claimed by this prototype.

The current evaluation target is deterministic scenario behaviour:

| Scenario | Expected |
| --- | --- |
| Safe family call | LOW |
| Human scam | HIGH / CRITICAL |
| AI voice impersonation | CRITICAL |
| Government scheme scam | CRITICAL |
| Legitimate scheme conversation | LOW / MEDIUM |
| Bank impersonation | HIGH / CRITICAL |
| Trusted-person impersonation | HIGH / CRITICAL |

Before deployment, evaluate each signal family independently, then compare voice-only, voice plus fraud, voice plus behaviour, voice plus context, and the full fusion pipeline. Report false positives and false negatives separately.