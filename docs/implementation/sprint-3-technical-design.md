# Sprint 3 — AI Platform Foundation Technical Design

**Sprint theme:** AI tutor, homework assistant, study planner, question/mock-test generators, usage analytics  
**Service:** `ai-service` (NestJS, port 3004)  
**Package:** `@eduai/ai` (provider router, prompts, cost tracking)  
**Status:** Implemented

---

## 1. Architecture Overview

```
apps/web / apps/admin (Next.js)
    │ Bearer JWT (from Auth.js session)
    ▼
services/ai-service (NestJS, :3004)
    │ @eduai/ai AiClient (OpenAI → Gemini → Mock fallback)
    │ Prisma + tenant filters
    ▼
packages/database (PostgreSQL)
    ai_conversations, ai_messages, ai_quota_usage
```

Sprint 3 establishes the **AI platform foundation** without RAG/embeddings (deferred to Sprint 8). All features work with mock responses when API keys are absent.

---

## 2. packages/ai

| Module | Responsibility |
|--------|----------------|
| `providers/openai.ts` | OpenAI Chat Completions (optional peer `openai`) |
| `providers/gemini.ts` | Gemini REST API via `fetch` |
| `providers/mock.ts` | Deterministic JSON/text mock for dev |
| `router.ts` | Provider ordering, fallback on failure |
| `prompts/index.ts` | System prompts + user prompt builders |
| `cost-tracker.ts` | `CostTracker` interface + `InMemoryCostTracker` |
| `client.ts` | `AiClient`: `chat()`, `tutorMessage()`, `analyzeHomework()`, `generateQuestions()`, `planStudy()`, `generateMockTest()` |

### Provider routing

1. Preferred provider from `AI_PREFERRED_PROVIDER` (default `openai`)
2. Other available providers (gemini if key present)
3. Mock provider when `allowMockFallback` is true (default)

### Environment variables

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | OpenAI provider |
| `GEMINI_API_KEY` | Gemini provider |
| `AI_PREFERRED_PROVIDER` | `openai` \| `gemini` \| `mock` |

---

## 3. Database Schema (Sprint 3 Migration)

| Table | Purpose |
|-------|---------|
| `ai_conversations` | Tutor/homework/general conversation sessions |
| `ai_messages` | User/assistant/system messages with token counts |
| `ai_quota_usage` | Daily per-user query + token aggregates |

Enums: `AiConversationType` (`tutor`, `homework`, `general`), `AiMessageRole` (`user`, `assistant`, `system`).

Migration: `20250620140000_sprint3_ai`

---

## 4. API Design (`/api/v1`)

### Tutor
- `POST /tutor/chat` — Chat with AI tutor, persists conversation
  - Body: `{ message, conversationId?, lessonId?, subjectId? }`
  - Permission: `ai:tutor:use:own`

### Homework
- `POST /homework/analyze` — Analyze homework text (stub OCR for images)
  - Body: `{ text?, imageUrl? }`
  - Permission: `ai:homework:use:own`

### Planner
- `POST /planner/generate` — Generate study plan
  - Body: `{ subjects[], goals, availableHoursPerWeek, examDate?, classLevel? }`
  - Permission: `ai:tutor:use:own`

### Generators
- `POST /generators/questions` — Generate assessment questions
  - Permission: `ai:qpg:use:school`
- `POST /generators/mock-test` — Generate full mock test
  - Permission: `ai:qpg:use:school`

### Analytics
- `GET /analytics/usage?userId=` — Token/query usage (own or tenant-wide for admins)
  - Permission: `ai:tutor:use:own` | `ai:quota:manage:tenant` | `analytics:read:tenant`

### Health
- `GET /health` — Liveness (public)
- `GET /health/ready` — DB readiness (public)

---

## 5. Conversation Persistence Flow

```
POST /tutor/chat
  → findOrCreateConversation(tenant, user, type)
  → load last 20 messages as history
  → save user message
  → AiClient.tutorMessage()
  → save assistant message (tokens, model, provider)
  → upsert ai_quota_usage for today
  → return { conversationId, message, model, provider, tokensUsed }
```

Homework and planner follow the same pattern with type-specific AI calls.

---

## 6. RBAC Permissions

| Endpoint | Permission |
|----------|------------|
| Tutor chat | `ai:tutor:use:own` |
| Homework analyze | `ai:homework:use:own` |
| Study planner | `ai:tutor:use:own` |
| Question generator | `ai:qpg:use:school` |
| Mock test generator | `ai:qpg:use:school` |
| Usage analytics (own) | `ai:tutor:use:own` |
| Usage analytics (tenant) | `ai:quota:manage:tenant` or `analytics:read:tenant` |

---

## 7. Stubbed / Deferred

| Feature | Sprint 3 | Future |
|---------|----------|--------|
| OCR for homework images | URL stub text | Sprint 8 vision/OCR |
| RAG / content embeddings | Not implemented | Sprint 8 |
| Live OpenAI/Gemini | Works when keys set; mock otherwise | Production keys |
| Quota enforcement (hard limits) | Tracking only | Sprint 4+ billing |
| Web UI for AI features | Not in Sprint 3 | Sprint 4+ |

---

## 8. Testing

| Package/Service | Framework | Coverage |
|-----------------|-----------|----------|
| `@eduai/ai` | Vitest | `client.test.ts` — mock provider, cost tracker, all client methods |
| `ai-service` | Jest | `tutor.service.spec.ts` — conversation flow with mocked AI |

---

## 9. Service Dependencies

```
ai-service
  ├── @eduai/ai
  ├── @eduai/database
  ├── @eduai/auth
  └── @eduai/shared
```

Port: **3004** (default). Swagger: `http://localhost:3004/api/docs`
