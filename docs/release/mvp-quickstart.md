# EduAI MVP — Local Quick Start

Run the full EduAI stack locally for demos and closed beta.

## 1. One-time setup

```powershell
cd "g:\AI Learning\EduAI"
Copy-Item .env.example .env -ErrorAction SilentlyContinue
pnpm install
docker compose -f infrastructure/docker/docker-compose.yml up -d
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## 2. Start backend services (5 terminals)

```powershell
pnpm --filter @eduai/identity-service dev   # :3001
pnpm --filter @eduai/learning-service dev   # :3003
pnpm --filter @eduai/ai-service dev         # :3004
pnpm --filter @eduai/erp-service dev          # :3005
pnpm --filter @eduai/billing-service dev      # :3006
```

## 3. Start frontends (2 terminals)

```powershell
pnpm --filter @eduai/web dev    # :3000 — student/teacher/parent
pnpm --filter @eduai/admin dev  # :3002 — admin CRM
```

Or run everything: `pnpm mvp:dev` (requires Docker + DB seeded).

## 4. Login

| Portal | URL | Email | Password |
|--------|-----|-------|----------|
| Web (student) | http://localhost:3000 | student@demo.eduai.in | Demo1234! |
| Web (teacher) | http://localhost:3000 | teacher@demo.eduai.in | Demo1234! |
| Web (parent) | http://localhost:3000 | parent@demo.eduai.in | Demo1234! |
| Admin | http://localhost:3002 | admin@demo.eduai.in | Demo1234! |

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `ClientFetchError` / MissingSecret | Ensure root `.env` exists with `AUTH_SECRET` (32+ chars). Restart web/admin after changes. |
| Login fails | Start `identity-service` on :3001 first. |
| Database errors | Check Docker Postgres on port **5433**. Run `pnpm db:seed`. |
| Port in use | Stop the process on that port or change `PORT` in `.env`. |

## MVP scope

- Auth + RBAC across all roles
- Student learning (courses, quizzes, gamification)
- AI tutor, homework, planner (mock AI without API keys)
- Teacher + parent + admin portals
- ERP + billing APIs (demo data)

Not in MVP: production deploy, full content catalog, App Store release.
