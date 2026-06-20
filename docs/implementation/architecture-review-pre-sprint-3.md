# Architecture Review — Pre Sprint 3 (AI Platform)

**Date:** June 20, 2025  
**Reviewer:** EduAI Engineering  
**Scope:** Assess Sprint 2 foundation readiness for AI integration

---

## 1. Executive Summary

Sprint 2 delivers a **tenant-aware learning data layer** suitable as context for AI features. The shared PostgreSQL database, JWT auth chain, and RBAC matrix are ready. Sprint 3 should add AI-specific tables (conversations, embeddings, quota), provider abstraction in `@eduai/ai`, and strict cost controls before production AI exposure.

**Recommendation:** Proceed with Sprint 3 using `ai-service` on port 3004, shared JWT validation, and per-tenant token budgets already on `tenants.ai_monthly_token_budget`.

---

## 2. Database Design Implications for AI

### Current State (Post Sprint 2)

| Table Group | Rows (demo) | AI Relevance |
|-------------|-------------|--------------|
| Curriculum (boards→lessons) | ~20 | RAG context source |
| Progress/quiz attempts | Per user | Personalization input |
| Gamification | Per user | Engagement signals |
| Translations | 4 demo | Multilingual tutor prompts |

### Required for Sprint 3

| Table | Purpose | Priority |
|-------|---------|----------|
| `ai_conversations` | Tutor/homework sessions | P0 |
| `ai_messages` | Message history + token counts | P0 |
| `ai_quota_usage` | Daily per-user token tracking | P0 |
| `content_embeddings` | pgvector RAG (1536-dim) | P1 |
| `generated_papers` | Mock test output | P2 |

### Schema Concerns

1. **pgvector extension** — Required for RAG; adds ~6MB index per 10K chunks. Enable in migration before Sprint 3 production.
2. **Conversation retention** — Docs specify 90-day TTL; implement cron job or partition strategy.
3. **PII in prompts** — Student names/grades in context; mask in logs, encrypt at rest for messages.
4. **Shared DB load** — AI write-heavy (messages) coexists with progress writes; monitor connection pool (Prisma default 10).

---

## 3. Cost Model & Token Budgets

### Tenant Budget (existing)

```prisma
aiMonthlyTokenBudget  Int  @default(1000000)  // tenants table
```

### Estimated Costs (GPT-4o-mini / Gemini Flash)

| Feature | Avg tokens/request | Cost @ $0.15/1M input | 1K students/day |
|---------|-------------------|----------------------|-----------------|
| AI Tutor turn | 2,000 | $0.0003 | $0.30/day |
| Homework OCR+solve | 5,000 | $0.00075 | $0.75/day |
| Study planner | 3,000 | $0.00045 | $0.45/day |
| Question generator | 4,000 | $0.0006 | $0.60/day |

**Monthly estimate (1K active students, 5 AI interactions/day):** ~$600–900 without caching.

### Cost Controls (Sprint 3 must implement)

| Control | Implementation |
|---------|----------------|
| Per-tenant monthly cap | Check `ai_quota_usage` vs `aiMonthlyTokenBudget` |
| Per-user daily limit | 50 queries/day default |
| Response caching | Redis hash of (prompt hash → response), 24h TTL |
| Model routing | Simple queries → Gemini Flash; complex → GPT-4o |
| Fallback | Gemini unavailable → OpenAI; both fail → graceful error |

---

## 4. Observability Requirements

| Signal | Tool (target) | Sprint |
|--------|---------------|--------|
| Request latency p95 | OpenTelemetry → Grafana | 3 |
| Token usage per tenant | `ai_quota_usage` + dashboard | 3 |
| Error rate by provider | Structured logs + Sentry | 3 |
| Cost anomaly alerts | Daily spend > 120% baseline | 4 |
| RAG retrieval quality | Human eval sample + thumbs | 4 |

**Current gap:** Console logging only. Sprint 3 should add request IDs (already in `@eduai/shared`) to AI service logs.

---

## 5. Scaling Implications

### AI Service (stateless)

- Horizontal scale: K8s HPA on CPU + request queue depth
- Streaming responses: SSE for tutor chat (reduces perceived latency)
- Rate limiting: Shared Redis store (currently unused from Sprint 1)

### RAG Pipeline (Sprint 3+)

```
Lesson content → chunk (512 tokens) → embed → pgvector
User query → embed → cosine search (top 5) → inject context → LLM
```

**Scale limits:**
- 100K chunks: IVFFlat index, ~200ms search
- 1M chunks: Consider dedicated vector DB (Pinecone/Qdrant)

### Multilingual AI

- UI i18n: `@eduai/i18n` (static strings) ✅
- Content i18n: `translations` table ✅
- AI responses: System prompt locale directive + Gemini multilingual support
- Hindi/Marathi math notation: Test with NCERT-style content

---

## 6. Security for AI Features

| Risk | Mitigation |
|------|------------|
| Prompt injection | System prompt hardening, input length limits |
| Data leakage across tenants | Tenant ID in all AI queries; RLS on conversations |
| Homework image uploads | Size limit 5MB, MIME validation, no EXIF |
| Student PII in logs | Redact names/emails from AI service logs |
| API key exposure | Server-side only; never in web bundle |

---

## 7. Integration Points (Sprint 2 → Sprint 3)

| Sprint 2 Asset | AI Use |
|----------------|--------|
| `lessons` + `lesson_contents` | RAG source documents |
| `lesson_progress` | Study planner weak areas |
| `quiz_attempts` + scores | Mock test difficulty calibration |
| `user.locale` | Tutor language selection |
| `JWT permissions` `ai:tutor:use:own` | Endpoint guards |
| learning-service internal API pattern | Award XP for AI study sessions (optional) |

---

## 8. Go/No-Go for Sprint 3

| Criterion | Status |
|-----------|--------|
| Auth chain working | ✅ Go |
| Learning content in DB | ✅ Go |
| RBAC AI permissions defined | ✅ Go |
| Tenant token budget field | ✅ Go |
| pgvector extension | ⚠️ Migrate in Sprint 3 |
| Redis for cache/limits | ⚠️ Wire in Sprint 3 |
| Observability stack | ⚠️ Minimal logging Sprint 3; full stack Sprint 4 |

**Decision: GO** — Proceed with Sprint 3 AI service foundation.

---

## 9. Recommended Sprint 3 Architecture

```
apps/web ──► ai-service (:3004)
                 │
                 ├── @eduai/ai (provider router)
                 │     ├── OpenAI
                 │     └── Gemini (fallback)
                 │
                 ├── packages/database (conversations, quota)
                 └── Redis (cache + rate limits)
```

Defer separate `content-service` embedding pipeline to Sprint 3 Phase 2; initial tutor can use lesson text directly without vector search.

---

*Review completed. See `sprint-3-technical-design.md` for implementation plan.*
