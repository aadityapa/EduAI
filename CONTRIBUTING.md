# Contributing to EduAI

Thanks for your interest in contributing. This document covers the practical
steps for getting the monorepo running locally and the conventions we follow
for branches, commits, and pull requests.

## Prerequisites

- **Node.js** `>=20` (see `engines.node` in the root `package.json`)
- **pnpm** `9.15.0` (see `packageManager` in the root `package.json` — the
  repo uses pnpm workspaces, not npm or yarn)
- **Docker** (for local PostgreSQL and Redis via `docker compose`)
- **PowerShell** (some helper scripts under `backend/testing/scripts/*.ps1`
  are Windows/PowerShell-based; the rest of the tooling is cross-platform)

Enable pnpm via Corepack if you don't already have it:

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

## Getting Set Up

```bash
git clone <repository-url>
cd EduAI
cp .env.example .env
pnpm install
```

Bring up local infrastructure (PostgreSQL on `5433`, Redis on `6379`) and
prepare the database:

```bash
pnpm mvp:setup
# equivalent to:
#   docker compose -f backend/infrastructure/docker/docker-compose.yml up -d
#   pnpm db:generate
#   pnpm db:migrate
#   pnpm db:seed
```

Start the app(s) you're working on:

```bash
pnpm dev:backend    # identity, learning, ai, erp, billing services (ports 3001, 3003-3006)
pnpm dev:frontend   # web (:3000) + admin (:3002)
pnpm dev:mobile     # Expo Metro bundler (:8081)

# or everything at once:
pnpm mvp:dev
```

See the root `README.md` for the full port map and demo login credentials.

## Repository Structure

This is a pnpm + Turborepo monorepo. Workspaces are declared in
`pnpm-workspace.yaml`:

- `frontend/web`, `frontend/admin`, `frontend/mobile` — Next.js (web/admin)
  and Expo/React Native (mobile) apps
- `frontend/shared-ui/*` — shared frontend packages (`@eduai/ui`,
  `@eduai/i18n`, `@eduai/analytics`)
- `backend/services/*` — NestJS microservices (`identity-service`,
  `learning-service`, `ai-service`, `erp-service`, `billing-service`)
- `backend/shared/*` — shared backend packages (`@eduai/auth`,
  `@eduai/nest-common`, `@eduai/shared`, `@eduai/ai`)
- `backend/database` — Prisma schema, migrations, and seed scripts
  (`@eduai/database`)
- `backend/testing/load` — k6 load test workspace

Before making structural changes, please read `ARCHITECTURE.md`.

## Branch Naming

Use a short, descriptive branch name prefixed by type:

```
feature/<short-description>
fix/<short-description>
chore/<short-description>
docs/<short-description>
refactor/<short-description>
test/<short-description>
```

Examples: `feature/parent-fee-reminders`, `fix/jwt-refresh-race-condition`,
`docs/architecture-diagram`.

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short summary>

[optional body]

[optional footer(s)]
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
`chore`, `ci`, `build`.

Examples:

```
feat(billing-service): add Razorpay webhook signature verification
fix(web): correct timezone handling on the parent fee dashboard
docs: add repository architecture overview
```

Scope should generally match the affected workspace, e.g. `identity-service`,
`learning-service`, `ai-service`, `erp-service`, `billing-service`, `web`,
`admin`, `mobile`, `database`, `auth`, `shared`.

## Before Opening a Pull Request

Run the same checks CI runs, scoped to what you changed where possible
(Turborepo will only re-run tasks for affected packages):

```bash
pnpm lint        # turbo run lint
pnpm typecheck   # turbo run typecheck
pnpm test        # turbo run test
pnpm build       # turbo run build
```

If your change touches the Prisma schema, also run:

```bash
pnpm db:generate
pnpm db:migrate
```

## Pull Request Process

1. Fork or branch from `master`/`main`/`develop` as appropriate.
2. Keep PRs focused — prefer several small PRs over one large one.
3. Fill out the pull request template, including which service(s)/app(s) are
   affected and how you tested the change.
4. Ensure `lint`, `typecheck`, `test`, and `build` all pass locally; CI
   (`.github/workflows/ci.yml`) runs the same checks against a Postgres
   service container.
5. Request review from a relevant code owner (see `.github/CODEOWNERS`).
6. Squash or rebase as requested by the reviewer before merge.

## Sensitive Data

Never commit real secrets, API keys, `.env` files, or production database
dumps. Use `.env.example` as the template for required environment variables.
This platform stores student data — treat any local seed/test data
representing real students as sensitive, and prefer synthetic demo data
(see the demo accounts in `README.md`).

## Questions

For security-related questions, see `SECURITY.md`. For anything else, open a
GitHub issue using the appropriate template under `.github/ISSUE_TEMPLATE/`.
