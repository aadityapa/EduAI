# Repository Structure Review (Documentation Only)

**Status:** informational — no files were moved, renamed, or deleted as part
of this review. This document only records observations and proposes
low-risk, additive documentation/tooling improvements.

## Current Structure

The repository is already organized around two top-level source trees,
managed as a single pnpm + Turborepo workspace:

```
EduAI/
├── frontend/    web, admin, mobile apps + shared-ui packages
├── backend/     services, database, shared packages, infrastructure, testing, docs
├── .github/     workflows (ci.yml, deploy.yml)
├── pnpm-workspace.yaml
├── turbo.json
└── package.json
```

This matches what `pnpm-workspace.yaml` declares as workspace packages
(`frontend/web`, `frontend/admin`, `frontend/mobile`, `frontend/shared-ui/*`,
`backend/services/*`, `backend/shared/*`, `backend/database`,
`backend/testing/load`) and is consistent with the layout already documented
in `README.md`.

## Observation: `services/` and `infrastructure/` are not top-level

The task brief that prompted this review referenced top-level `services/` and
`infrastructure/` directories alongside `backend/` and `frontend/`. That is
**not** the current state of this repository — there is no top-level
`services/` or `infrastructure/` directory. Both live *inside* `backend/`:

- `backend/services/*` — the five NestJS microservices (identity, learning,
  ai, erp, billing)
- `backend/infrastructure/` — Docker, Kubernetes, Terraform, and monitoring
  configuration

This is confirmed by `backend/docs/repository-restructure-report.md`, which
documents a prior refactor that *consolidated* a previously flatter layout
(which did have top-level `services/`, `infrastructure/`, `packages/`,
`docs/`, `tests/`, `e2e/`, and `scripts/` directories, plus a
`backend/services/` *and* `backend/packages/` split) into the current
two-tree `frontend/` + `backend/` structure.

**Conclusion:** there is no current overlap or duplication between a
top-level `services/`/`infrastructure/` and `backend/services/`/
`backend/infrastructure/` — the consolidation already happened. No action is
needed here beyond keeping `README.md`, `ARCHITECTURE.md`, and any onboarding
material consistent about `backend/services/*` and
`backend/infrastructure/*` being the canonical locations, so a future
contributor doesn't recreate top-level `services/`/`infrastructure/`
directories by mistake.

## Other Observations (Low Risk, Documentation Only)

1. **License mismatch.** `README.md` states "Proprietary — EduAI Platform
   Engineering" in its License section, while this review adds a root `MIT`
   `LICENSE` file (per the documentation task brief, copyright "2026
   Karnex"). These two statements now conflict. **Recommendation:** the
   engineering/legal owner should decide which license actually applies and
   update `README.md`'s License section (and/or `LICENSE`) to match — this
   review does not resolve that decision, only flags it.
2. **README doc links may be stale.** `README.md` links to
   `docs/architecture/port-allocation.md`, `docs/release/mvp-quickstart.md`,
   and `docs/release/beta-launch-guide.md` as root-relative paths, but the
   actual documentation tree lives under `backend/docs/` (e.g.
   `backend/docs/release/mvp-quickstart.md` exists; a
   `docs/architecture/port-allocation.md` was not found at that exact path
   during this review). **Recommendation:** verify these links resolve
   correctly, or update them to point at `backend/docs/...`.
3. **`backend/docs/` is a large, flat-ish archive.** It contains many
   point-in-time audit/review/sprint reports (e.g. `audit/`, `release/`,
   `implementation/`, `execution/`, `hardening/`) alongside living reference
   docs (`database/database-schema.md`, `operations/architecture-guide.md`).
   No change is proposed here, but a future improvement could be a short
   `backend/docs/README.md` index distinguishing "living reference docs" from
   "historical point-in-time reports," so newcomers don't treat old audit
   snapshots as current state.

## Low-Risk Improvements Made in This Pass

The following files were added; none of them move or modify existing source
or configuration:

- `LICENSE` — MIT license text (see license-mismatch note above)
- `ARCHITECTURE.md` — architecture overview, service/app inventory, Mermaid
  request-flow diagram, repository layout tree
- `CONTRIBUTING.md` — setup, branching, commit, and PR conventions
- `SECURITY.md` — vulnerability disclosure policy (`security@karnex.in`)
- `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1
- `.github/CODEOWNERS` — default owner placeholder with a customization guide
- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/ISSUE_TEMPLATE/bug_report.md`, `feature_request.md`, `config.yml`
- `.editorconfig` — root-level editor consistency config
- This file (`REORG_PLAN.md`)

`.github/workflows/ci.yml` already existed (pnpm + Postgres service
container running lint/typecheck/test/build) and was left untouched, as
instructed.

## Explicitly Not Done

- No files were moved, renamed, or deleted.
- No existing source or configuration files were modified.
- No git commands were run.
- The `services/` vs `backend/services/` and `infrastructure/` vs
  `backend/infrastructure/` question was **investigated and found to be a
  non-issue** in the current tree — this document records that finding
  rather than proposing a migration.
