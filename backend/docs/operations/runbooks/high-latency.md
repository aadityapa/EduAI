# Runbook — High p95 latency

**Alert:** `HighLatencyP95` / `AIServiceHighLatency`  
**Target:** API p95 < 250 ms (load SLOs); warning fire at 500 ms / AI 4s.

## Triage

1. Grafana latency p95 by service; correlate with PodCPUHigh / PodMemoryHigh.
2. Check Postgres / Redis: connection pool saturation, slow queries (`connection-pooling.md`).
3. AI path: quota / upstream provider timeouts; mock fallback in non-prod.

## Mitigate

- Scale replicas / review HPA.
- Enable curriculum cache; flush pathological keys if miss spike.
- For AI: lower concurrency or route to cheaper model via feature flags.

## Evidence

Attach k6 snippet or Grafana screenshot to the incident ticket.
