# Phase 12 — Security & DPDP summary

## Engineering complete (Phase 9+)

- Consent + DSR APIs, parental consent scaffolding
- Threat model, residency doc (ap-south-1), OWASP ASVS checklist
- Field encryption helpers, immutable audit, SSRF/upload checks
- CI: gitleaks, audit, `security:scan`
- Fail-closed `AUTH_SECRET` / JWT in production

## Legal / compliance (not engineering)

- **DPDP legal opinion / DPIA:** pending external counsel — **blocker for public v1**
- Privacy policy / Terms: templates under `docs/release/app-store/**` — publish URLs required for stores

## Residual

- Full RLS `SET LOCAL` wiring deferred
- ClamAV live scanning via webhook optional
- Sentry DSN residency: scrubbing enabled; confirm India subprocessors before enabling PII
