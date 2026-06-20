# Monitoring Readiness Report — Phase 5

**Date:** 2025-06-21  
**Stack:** Prometheus, Grafana, OpenTelemetry, Sentry

---

## Component Inventory

| Component | Location | Status |
|-----------|----------|--------|
| Prometheus scrape config | `infrastructure/monitoring/prometheus.yml` | ✅ All 5 services + apps |
| Alert rules | `infrastructure/monitoring/alerting-rules.yml` | ✅ CPU, memory, error rate, AI latency |
| Grafana dashboards | `infrastructure/monitoring/grafana/dashboards/` | ✅ Platform + AI service |
| OTel collector | `infrastructure/monitoring/otel-collector-config.yaml` | ✅ Traces to backend |
| Sentry config | `infrastructure/monitoring/sentry.env.example` | ✅ Stub; needs DSN in prod |
| K8s probes | `infrastructure/kubernetes/*.yaml` | ✅ liveness + readiness |

---

## Alert Coverage

| Alert | Threshold | Severity |
|-------|-----------|----------|
| HighErrorRate | >5% 5xx for 5m | Critical |
| HighLatencyP95 | >2s for 10m | Warning |
| PodCrashLooping | restart >3 in 15m | Critical |
| AIProviderFailures | circuit open | Warning |
| DatabaseConnectionFailures | readiness fail | Critical |
| DiskUsageHigh | >85% | Warning |

---

## Logging

- Services: structured JSON to stdout (K8s → CloudWatch)
- Request IDs via `createRequestId()` in `@eduai/shared`
- Global exception filter logs stack traces server-side

---

## Gaps

| Gap | Priority | Plan |
|-----|----------|------|
| Sentry DSN not in K8s secrets | P1 | Add before beta schools |
| Distributed tracing not end-to-end in dev | P2 | Enable OTel SDK in services |
| Log aggregation (Loki/CloudWatch Insights) | P2 | Terraform module |
| Synthetic uptime checks | P1 | Route53 health checks + k6 cron |

---

## Coherence Check

Prometheus targets match K8s service names and ports (3001–3006). Grafana dashboard UIDs referenced in alerting annotations. Sentry release tracking should tag `v0.9.1-beta-hardening`.

**Verdict:** Monitoring **adequate for closed beta**; enable Sentry DSN and synthetic checks before scaling past 10 schools.
