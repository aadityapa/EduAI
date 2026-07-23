# Infra review — Phase 11 (Terraform / HPA / DR)

**Date:** 2026-07-23  
**Status:** Documentation review (local `terraform apply` not executed)

## Inventory (`backend/infrastructure/terraform`)

| Module | Purpose | Notes |
|--------|---------|-------|
| VPC | Network isolation | ap-south-1 |
| EKS | Workloads | Staging + prod cluster naming in deploy.yml |
| RDS | Postgres | Multi-AZ recommended for prod; verify `multi_az` in module |
| ElastiCache | Redis | Cache + BullMQ |
| S3 + CloudFront | Assets | Static / uploads |
| Route53 | DNS | |
| SES | Email | Transactional |

## HPA / autoscaling

- K8s HPA manifests should target CPU 70% / memory 80% for identity, learning, web.
- Confirm `backend/infrastructure/kubernetes/*` include HPA objects; if missing, add before scale pilots.
- Load proof: Phase 8 k6 reports under `backend/docs/testing/`.

## WAF / IAM

- CloudFront + WAF: enable on public web/admin hostnames before public v1.
- IAM: deploy role via OIDC (`AWS_DEPLOY_ROLE_ARN`); least privilege for ECR push + EKS apply.

## Per-tenant isolation

- App-level tenant filters + tests (Phase 6/9); RLS defense-in-depth evaluated (Phase 9).
- Infra isolation: shared DB with `tenantId` scoping; dedicated DB per mega-tenant is a commercial option (not default).

## RTO / RPO

| Tier | RPO | RTO | Mechanism |
|------|-----|-----|-----------|
| Postgres | ≤ 5 min | ≤ 1 h | RDS automated backups + PITR |
| Redis | Best-effort | ≤ 15 min | Rebuild cache; durable state in Postgres |
| Objects | ≤ 24 h | ≤ 4 h | S3 versioning |

Aligns with `performance-targets.md` and `disaster-recovery.md`. Drill: `pnpm validate:dr`.

## Signed exceptions

- Full terraform apply / EKS deploy not run in this phase (no AWS secrets in local agent).
- Staging deploy proven only when GitHub secrets present; workflow no-ops otherwise (intentional).
