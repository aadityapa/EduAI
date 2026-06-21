# Observability Review — Production Launch Validation

**Date:** 2025-06-21  
**Scope:** `backend/infrastructure/monitoring/`, service health endpoints, Sentry stubs

---

## Infrastructure Inventory

| Component | Path | Status |
|-----------|------|--------|
| Prometheus config | `backend/infrastructure/monitoring/prometheus.yml` | ✅ Defined |
| Alert rules | `backend/infrastructure/monitoring/alerting-rules.yml` | ✅ Defined |
| Grafana dashboards | `grafana/dashboards/platform-overview.json`, `ai-service.json` | ✅ Defined |
| OpenTelemetry collector | `backend/infrastructure/monitoring/otel-collector-config.yaml` | ✅ Defined |
| Sentry env template | `backend/infrastructure/monitoring/sentry.env.example` | ⚠️ Stub only |

---

## Prometheus Scrape Targets

Configured for **staging** K8s namespace `eduai-staging`:

| Job | Target | Metrics path |
|-----|--------|--------------|
| identity-service | :3001 | `/api/v1/metrics` |
| learning-service | :3003 | `/api/v1/metrics` |
| ai-service | :3004 | `/api/v1/metrics` |
| erp-service | :3005 | `/api/v1/metrics` |
| billing-service | :3006 | `/api/v1/metrics` |
| web | :3000 | default |
| admin | :3002 | default |
| kubernetes-pods | pod discovery | annotation-based |

Alertmanager target: `alertmanager.eduai-monitoring.svc.cluster.local:9093`

---

## Service Health Endpoints

All 5 implemented services expose:
- `GET /api/v1/health` — liveness
- `GET /api/v1/health/ready` — readiness (DB connectivity)

Verified in source: `services/*/src/health/health.controller.ts`

**Runtime verification:** Not executed (services not running during validation).

---

## Grafana Dashboards

### platform-overview.json
- Request rate, error rate, latency by service
- Pod CPU/memory (K8s metrics)

### ai-service.json
- AI token usage, tutor request rate
- Circuit breaker state
- Cost tracking

---

## OpenTelemetry

`otel-collector-config.yaml` defines:
- OTLP receivers (gRPC + HTTP)
- Batch processor
- Prometheus exporter + Jaeger trace export (config present)

**Wiring status:** Collector config exists; service instrumentation not verified in this audit.

---

## Sentry

- `sentry.env.example` documents `SENTRY_DSN`, environment, sample rate
- No `@sentry/node` integration found in service `main.ts` files
- **Error tracking: NOT WIRED**

---

## Alerting Rules Review

From `alerting-rules.yml` (static review):
- High error rate (>5% for 5m)
- High latency (p95 >2s)
- Pod restarts
- AI quota exhaustion

**Alert routing:** Alertmanager configured; PagerDuty/Slack integration not verified.

---

## Logging

| Service | Logger | Structured |
|---------|--------|------------|
| NestJS services | NestJS Logger | Partial JSON in prod bootstrap |
| Next.js apps | console | ❌ No centralized logging |
| AI audit | In-memory | ❌ Not persisted |

---

## Gaps

| Gap | Severity | Impact |
|-----|----------|--------|
| Sentry not integrated | High | No production error tracking |
| OTEL not verified end-to-end | Medium | Trace gaps |
| No log aggregation (ELK/Loki) | Medium | Incident debugging hard |
| Production Prometheus not deployed | Medium | No live metrics in this validation |
| Synthetic monitoring | Low | Only config in Grafana docs |

---

## Recommendations

1. Wire `@sentry/nestjs` to all 5 services — **P0 for v1.0**
2. Deploy monitoring stack to staging; verify scrape targets resolve
3. Add Loki or CloudWatch for centralized logs
4. Enable synthetic checks: login + tutor every 5 min
5. Run `docs/operations/monitoring-readiness-report.md` checklist against live cluster

---

## Verdict

| Launch type | Verdict |
|-------------|---------|
| Closed beta | **GO** — health endpoints + configs sufficient with manual monitoring |
| Public v1.0 | **NO-GO** — Sentry unwired, no live observability validation |

**Operations/Observability score: 6/10**
