---
name: Generated API client typing
description: TypeScript DOM iterable requirements for generated fetch clients in this workspace
---

Generated API clients can use `Headers.entries()`, so the client library TypeScript config must include `dom.iterable` alongside `dom`; otherwise codegen succeeds but the shared library typecheck fails.

**Why:** The workspace's generated fetch helper depends on iterable DOM APIs that are not included by `dom` alone.

**How to apply:** When a new API contract regenerates the client, keep the shared client lib target configured with both DOM libraries before diagnosing generated-code errors.