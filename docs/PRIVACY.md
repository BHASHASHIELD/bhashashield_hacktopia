# Privacy boundaries

The demo follows a data-minimization rule:

```text
process voice or transcript -> derive structured signals -> discard raw voice
```

The current interface does not upload or persist raw call audio. Analysis responses redact numeric credential-like values and common OTP/PIN/password phrases before the result is returned to the UI.

The current API stores only synthetic in-memory summaries during the session. It does not implement the requested durable seven-day learning buffer yet. A production implementation must retain only minimal metadata, structured outputs, redacted transcript fragments when necessary, and explicit user feedback, with an expiry timestamp and automatic deletion job.

Never store OTPs, PINs, CVVs, passwords, authentication codes, or permanent raw voice archives.