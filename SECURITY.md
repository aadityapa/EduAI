# Security Policy

## Our Commitment

EduAI is a multi-tenant education platform used by schools, teachers, students,
and parents. The platform stores sensitive student data — including personally
identifiable information (PII), academic records, attendance, and billing/payment
details. We take the security and privacy of this data seriously and appreciate
the efforts of security researchers and the community in helping us keep the
platform safe.

## Supported Versions

EduAI is developed as a single, continuously-deployed monorepo (no long-lived
version branches). Security fixes are applied to the `master`/`main` branch and
released as part of the next deployment. There are no separately maintained
release lines to track.

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in any part of this repository
(backend services, frontend apps, infrastructure configuration, or CI/CD
pipelines), please report it privately by emailing:

**security@karnex.in**

Please include as much of the following as you can:

- A description of the vulnerability and its potential impact.
- Steps to reproduce, including affected service(s) (e.g. `identity-service`,
  `billing-service`) or app(s) (e.g. `frontend/web`, `frontend/admin`).
- Any relevant logs, screenshots, or proof-of-concept code.
- Whether the issue affects student data, authentication (JWT/session), or
  payment/billing flows — these are treated as highest priority.

### What to expect

- **Acknowledgement:** within 2 business days of your report.
- **Initial assessment:** within 5 business days, including a severity
  rating and expected remediation timeline.
- **Resolution:** timelines depend on severity, but we prioritize any issue
  that could expose student PII, academic records, authentication secrets, or
  payment data.
- **Disclosure:** we ask that you give us a reasonable window to remediate
  before any public disclosure. We are happy to credit reporters (with
  permission) once a fix has shipped.

### Scope

In scope:
- `backend/services/*` (identity, learning, ai, erp, billing services)
- `backend/shared/*` (auth, nest-common, shared, ai packages)
- `backend/database` (Prisma schema, migrations)
- `frontend/web`, `frontend/admin`, `frontend/mobile`
- `backend/infrastructure` (Docker, Kubernetes, Terraform, monitoring configs)
- CI/CD workflows under `.github/workflows`

Out of scope:
- Denial-of-service testing against shared/staging infrastructure.
- Social engineering, physical security, or spam.
- Findings that require a jailbroken/rooted device or an already-compromised
  environment.

## Handling of Student Data

Given the sensitivity of the data handled by this platform (minors' PII,
academic records, guardian contact information, and payment details), any
report involving unauthorized access to, or exposure of, student or guardian
data will be treated as **critical severity** regardless of exploit complexity.

## Secrets and Configuration

If you find a committed secret, API key, or credential (for example in `.env`
files, Kubernetes manifests, or CI configuration), please report it via the
same channel above rather than filing a public issue.
