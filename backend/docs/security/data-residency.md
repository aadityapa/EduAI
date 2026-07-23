# Data residency — India first (Phase 9)

**Status:** Engineering documentation + configuration hooks  
**Primary region:** `ap-south-1` (AWS Mumbai)  
**Env:** `DATA_RESIDENCY_REGION` (default `ap-south-1`)

## Policy intent (product assumption — not legal advice)

EduAI targets Indian schools and processes personal data of children. Default deployment keeps **primary data stores in India**:

| Store | Default residency | Notes |
|-------|-------------------|-------|
| PostgreSQL (RDS) | `ap-south-1` | Tenant PII, consents, DSR, academic data |
| Redis / ElastiCache | `ap-south-1` | Sessions cache, throttles — no long-term PII |
| Object storage (S3) | `ap-south-1` | Homework uploads, exports |
| Application pods (EKS) | `ap-south-1` | Nest + Next workloads |

Cross-region replication for DR must be an **explicit tenant/enterprise decision** with contractual cover. Default: disabled.

## Configuration hooks

```bash
DATA_RESIDENCY_REGION=ap-south-1
# Optional human-readable note for runbooks / DSR export metadata
DATA_RESIDENCY_NOTES="Primary: AWS Mumbai (ap-south-1). Cross-region replication disabled by default."
```

- DSR export packages include `residency_region` from `DATA_RESIDENCY_REGION`.  
- Terraform / K8s manifests should pin AWS region to Mumbai for production (Phase 11 review).  
- Third-party AI providers (OpenAI/Gemini) may process prompts outside India when keys are configured — disclose in school agreements; prefer India-capable endpoints when available.

## Data minimization

- Collect only fields needed for education delivery and billing.  
- Consent is **purpose-limited** (`ConsentPurpose` enum).  
- Marketing / third-party sharing require explicit granted consent.  
- Exports exclude password hashes and payment provider secrets.

## Operator checklist

1. Confirm RDS, S3, Redis region = `ap-south-1` in staging/prod.  
2. Confirm `DATA_RESIDENCY_REGION` set in service env.  
3. Confirm no ad-hoc analytics warehouses outside India without DPA.  
4. Document any subprocessors (AI, email, payments) for schools.
