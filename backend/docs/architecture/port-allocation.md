# EduAI Port Allocation

Frontend and backend run on **separate ports**. Never colocate API and UI on the same port.

## Frontend (UI)

| App | Port | URL | Users |
|-----|------|-----|-------|
| **Web Portal** | **3000** | http://localhost:3000 | Student, Teacher, Parent |
| **Admin CRM** | **3002** | http://localhost:3002 | Platform / Tenant / School Admin |
| **Mobile (Expo Metro)** | **8081** | Expo Go / Simulator | Student, Teacher, Parent |

## Backend (API only — NestJS)

| Service | Port | URL | Health |
|---------|------|-----|--------|
| Identity | **3001** | http://localhost:3001 | `/api/v1/health` |
| Learning | **3003** | http://localhost:3003 | `/api/v1/health` |
| AI | **3004** | http://localhost:3004 | `/api/v1/health` |
| ERP | **3005** | http://localhost:3005 | `/api/v1/health` |
| Billing | **3006** | http://localhost:3006 | `/api/v1/health` |

## Infrastructure

| Service | Port |
|---------|------|
| PostgreSQL | 5433 |
| Redis | 6379 |

## Start commands

```powershell
# Backend only (APIs)
pnpm dev:backend

# Frontend only (Web + Admin)
pnpm dev:frontend

# Mobile (Metro on 8081)
pnpm dev:mobile

# Everything
pnpm mvp:dev
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (:3000, :3002, :8081)       │
│  apps/web  apps/admin  apps/mobile                       │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP / REST
┌──────────────────────────▼──────────────────────────────┐
│                     BACKEND (:3001–3006)                 │
│  identity  learning  ai  erp  billing                    │
└──────────────────────────┬──────────────────────────────┘
                           │
              PostgreSQL :5433   Redis :6379
```

Web and Admin are **separate Next.js apps**. They call backend APIs via `NEXT_PUBLIC_*_SERVICE_URL` env vars — no business logic in the frontend repo routes except Auth.js sessions.
