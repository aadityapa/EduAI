# EduAI Sprint 3 — Completion Report

**Sprint theme:** AI Platform Foundation  
**Status:** Complete (local dev ready, mock AI when no API keys)

---

## What Was Built

### Database (`backend/database`)

**Migration:** `20250620140000_sprint3_ai`

| Table | Purpose |
|-------|---------|
| `ai_conversations` | Tutor, homework, and general AI sessions |
| `ai_messages` | Message history with token counts and model metadata |
| `ai_quota_usage` | Daily per-user query and token aggregates |

Enums: `AiConversationType`, `AiMessageRole`

### backend/shared/ai

| File | Status |
|------|--------|
| `src/providers/openai.ts` | Working (requires `OPENAI_API_KEY` + optional `openai` peer) |
| `src/providers/gemini.ts` | Working (requires `GEMINI_API_KEY`) |
| `src/providers/mock.ts` | Working — default when no keys |
| `src/router.ts` | Working — fallback chain |
| `src/prompts/index.ts` | Working — tutor, homework, planner, question-gen, mock-test |
| `src/cost-tracker.ts` | Working — interface + in-memory implementation |
| `src/client.ts` | Working — `chat()`, `generateQuestions()`, `planStudy()`, etc. |
| `src/client.test.ts` | 8 vitest tests |

### ai-service (NestJS, port 3004)

| Module | Endpoint | Status |
|--------|----------|--------|
| Tutor | `POST /tutor/chat` | Working — persists conversations |
| Homework | `POST /homework/analyze` | Working — stub OCR for `imageUrl` |
| Planner | `POST /planner/generate` | Working |
| Generators | `POST /generators/questions` | Working |
| Generators | `POST /generators/mock-test` | Working |
| Analytics | `GET /analytics/usage` | Working — own + tenant admin views |
| Health | `GET /health`, `GET /health/ready` | Working |

**Tests:** `tutor.service.spec.ts` (Jest)

---

## What's Working vs Stubbed

### Working

- JWT auth, RBAC guards, Prisma persistence (same patterns as learning-service)
- Multi-provider AI routing with automatic mock fallback
- Conversation and message storage in `ai_conversations` / `ai_messages`
- Daily usage tracking in `ai_quota_usage`
- OpenAPI docs at `/api/docs`
- Vitest + Jest test suites

### Stubbed / Requires Configuration

| Item | Notes |
|------|-------|
| **Mock AI responses** | Used when `OPENAI_API_KEY` and `GEMINI_API_KEY` are unset |
| **Homework OCR** | `imageUrl` returns `[OCR stub]` text — no vision API |
| **RAG / embeddings** | Not in Sprint 3 (Sprint 8) |
| **Hard quota limits** | Usage tracked but not enforced |
| **Web UI** | No student/teacher AI pages in Sprint 3 |

---

## How to Run

```bash
cd EduAI
cp .env.example .env   # DATABASE_URL, JWT_SECRET required
docker compose -f backend/infrastructure/docker/docker-compose.yml up -d
pnpm install
pnpm db:generate
pnpm db:migrate
```

**Optional — live AI:**

```env
OPENAI_API_KEY=sk-...
# or
GEMINI_API_KEY=...
AI_PREFERRED_PROVIDER=openai
```

**Start services:**

```bash
pnpm --filter @eduai/identity-service dev    # :3001
pnpm --filter @eduai/ai-service dev          # :3004
```

**Run tests:**

```bash
pnpm --filter @eduai/ai test
pnpm --filter @eduai/ai-service test
pnpm --filter @eduai/ai-service build
```

**Example — tutor chat:**

```bash
curl -X POST http://localhost:3004/api/v1/tutor/chat \
  -H "Authorization: Bearer <jwt>" \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain fractions"}'
```

---

## Sprint 3 Scope Boundaries

- Did **not** rebuild Sprint 1 (auth/identity) or Sprint 2 (learning-service)
- Did **not** add web UI for AI features
- Did **not** implement RAG, embeddings, or real OCR
