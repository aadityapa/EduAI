# Runbook — Pod CPU / memory pressure

**Alerts:** `PodCPUHigh`, `PodMemoryHigh`

1. Confirm HPA status: `kubectl get hpa -n eduai-staging`.
2. Check for memory leaks / unbounded caches; restart if OOMKilled.
3. Review Terraform/HPA targets (`backend/docs/operations/infra-review-phase11.md`).
4. Temporarily raise limits only with capacity plan note.
