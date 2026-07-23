# On-call & incident response (Phase 11)

## Severity

| Sev | Example | Response |
|-----|---------|----------|
| P1 | Identity down, billing webhook storm, data leak | Page immediately; bridge in 15m |
| P2 | Elevated 5xx, AI latency | Respond 30m business / 1h off-hours |
| P3 | Single-tenant degradation | Next business day |

## Flow

1. Acknowledge alert (PagerDuty / OpsGenie / Slack).
2. Open runbook linked from alert `runbook_url`.
3. Capture `traceId` from error envelope / logs.
4. Mitigate (flag / rollback / scale).
5. Write incident note; schedule postmortem for P1/P2.

## Contacts

Maintain roster outside git (PagerDuty). Engineering owners by service in CODEOWNERS when available.

## DR

Execute `pnpm validate:dr` quarterly; record evidence in `dr-test-report.md`.
