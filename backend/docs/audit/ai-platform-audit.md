# EduAI AI Platform Audit — Sprint 3 Production Readiness

**Date:** June 2025  
**Scope:** `backend/shared/ai`, `services/ai-service`, AI database schema, web/admin AI UIs  
**Auditor:** EduAI Platform Engineering

---

## Executive Summary

Sprint 3 foundation (commit `4b53d1c`) provided API stubs with mock AI fallback. Sprint 3 production readiness extends this into a **production-capable AI platform** with streaming tutor, full homework pipeline, study planner, question/mock-test generators, analytics, security controls, cost optimization, and observability stubs.

| Area | Pre-Sprint-3 | Post Production Readiness |
|------|--------------|---------------------------|
| Tutor | REST only, no UI | SSE streaming + Student/Teacher/Parent UIs |
| Homework | Text + OCR stub | Full pipeline + history + vision when keys set |
| Security | JWT + RBAC only | Prompt guard, content filter, audit logs |
| Cost | Tracking only | Quota enforcement, caching, budget controls |
| Observability | Console logs | Structured JSON logging, Prometheus metrics |
| Tests | 9 tests | 25+ unit/integration tests + E2E scaffold |

---

## Architecture Review

### Components

```
apps/web ──► ai-service (:3004) ──► @eduai/ai ──► OpenAI / Gemini / Mock
apps/admin ──┘         │
                         ├── PostgreSQL (ai_conversations, ai_messages, ai_quota_usage)
                         └── Prometheus /metrics endpoint
```

### Strengths

- Multi-provider router with automatic mock fallback for dev/CI
- Tenant-scoped conversation persistence (`tenant_id` on all AI records)
- Consistent NestJS patterns (guards, DTOs, Swagger) matching learning-service
- Shared `@eduai/ai` package decouples provider logic from service layer

### Technical Debt

| Item | Severity | Notes |
|------|----------|-------|
| Streaming uses mock chunker when no live provider stream | Medium | OpenAI streaming adapter not yet wired; mock streams work |
| RAG / embeddings | High (deferred) | Planned Sprint 8; tutor lacks curriculum grounding |
| Redis-backed response cache | Medium | In-memory cache only; not shared across instances |
| Cost tracker in-memory in `@eduai/ai` | Medium | Service persists quota to DB; client cache is process-local |
| PDF OCR | Medium | PDF extraction is stub; vision API works for images with `OPENAI_API_KEY` |
| Audit logs in-memory | Medium | `AuditService` retains last 1000 entries; needs DB table for compliance |
| WebSocket alternative | Low | SSE chosen; WS optional for bidirectional |

### Missing Components (Future)

- Dedicated `ai_audit_logs` Prisma model
- Redis cache layer for response/prompt caching at scale
- Embedding pipeline + vector store (Pinecone/pgvector)
- Real-time cost alerts (Slack/email webhooks)
- Model routing by task complexity (cheap model for hints, premium for essays)

---

## Security Assessment

| Control | Status |
|---------|--------|
| JWT authentication | ✅ |
| RBAC permissions (`ai:tutor:use:own`, etc.) | ✅ |
| Rate limiting (Throttler 120/min, 30/min AI) | ✅ |
| Prompt injection detection | ✅ `guardPrompt()` |
| Content safety filter | ✅ `filterContent()` |
| Helmet HTTP headers | ✅ |
| CORS restricted to web/admin origins | ✅ |
| Audit logging | ⚠️ In-memory only |
| Secrets in `.env` (gitignored) | ✅ |

### Risks

1. **Prompt injection** — Pattern-based guard catches common attacks; not ML-based. Recommend red-team testing before production.
2. **PII in prompts** — No automatic PII scrubbing; tenant admins should configure data policies.
3. **API key exposure** — Keys only in server env; web calls ai-service, never providers directly. ✅

---

## Cost & Scaling

| Metric | Current Implementation |
|--------|------------------------|
| Token tracking | Per-message in `ai_messages`, daily aggregate in `ai_quota_usage` |
| Daily quota | `aiMonthlyTokenBudget / 30` per user enforced in `CostService` |
| Response cache | 5-min TTL, 500 entries max (in-memory) |
| Prompt cache | 1-hour TTL per feature/tenant |
| Cost estimate | $2.50 / 1M tokens (configurable heuristic) |

### Scaling Risks

- Single-process in-memory caches won't dedupe across replicas → add Redis
- No queue for long-running homework OCR → may timeout on large PDFs
- Database conversation history capped at 20 messages per request → adequate for MVP

---

## Database Schema

| Table | tenant_id | Purpose |
|-------|-----------|---------|
| `ai_conversations` | ✅ | Session metadata, context (subject/lesson) |
| `ai_messages` | via conversation | History, tokens, model, metadata (sources) |
| `ai_quota_usage` | ✅ | Daily query/token aggregates per user |

Enums: `AiConversationType` (tutor, homework, general), `AiMessageRole` (user, assistant, system)

---

## Recommendations

1. **Before production:** Persist audit logs to DB; add Redis cache
2. **Sprint 4 prep:** Wire OpenAI streaming; add `ai_audit_logs` migration
3. **Monitoring:** Deploy Prometheus scraper from `backend/infrastructure/monitoring/`
4. **Load test:** Target 30 concurrent tutor streams per tenant

---

## Go/No-Go Inputs

This audit supports a **conditional Go** for staging/beta with mock or limited API keys. Full production Go requires audit log persistence and Redis caching (tracked in Sprint 4 plan).
