# Disaster Recovery Plan

## RPO / RTO Targets

| Tier | RPO | RTO |
|------|-----|-----|
| Beta (v0.9) | 24 hours | 4 hours |
| Production (v1.0) | 1 hour | 1 hour |
| Scale (v2.0) | 15 min | 30 min |

## Backup Policies

### RDS PostgreSQL
- Automated daily snapshots (7-day retention)
- Manual snapshot before each migration
- Cross-region snapshot copy to ap-southeast-1 (weekly)

### Redis (ElastiCache)
- Daily RDB snapshots
- Non-critical for beta (cache rebuild on restore)

### S3 Content
- Versioning enabled
- Cross-region replication to DR bucket

## Recovery Procedures

### Database Restore

```bash
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier eduai-db-restored \
  --db-snapshot-identifier eduai-db-snapshot-YYYYMMDD
```

Update K8s secret `DATABASE_URL` and restart services.

### Service Failover

1. Route53 health checks detect ALB failure
2. Failover to DR region CloudFront origin
3. Promote RDS read replica in DR region

### Full Region Failure

1. Activate DR runbook in `docs/operations/disaster-recovery.md`
2. Restore RDS from cross-region snapshot
3. Deploy K8s manifests to DR EKS cluster
4. Update DNS to DR CloudFront distribution

## Testing

- Quarterly DR drill: restore snapshot to staging
- Document results in audit log

## Contacts

- Platform on-call: platform@eduai.in
- AWS Support: Business tier recommended for production
