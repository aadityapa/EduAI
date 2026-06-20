# Production Deployment Guide

## Prerequisites

- AWS account with OIDC GitHub Actions role
- Terraform state bucket + DynamoDB lock table
- Domain `eduai.in` in Route53
- Secrets: `DATABASE_URL`, `JWT_SECRET`, `AUTH_SECRET`, `STRIPE_*`, `RAZORPAY_*`

## Step 1: Infrastructure (Terraform)

```bash
cd infrastructure/terraform
terraform init
terraform plan -var="environment=staging"
terraform apply -var="environment=staging"
```

Creates: VPC, EKS, RDS PostgreSQL 16, ElastiCache Redis, S3, CloudFront, SES, Route53.

## Step 2: Kubernetes Secrets

```bash
kubectl create namespace eduai-staging
kubectl create secret generic eduai-platform-secrets \
  --from-literal=DATABASE_URL='postgresql://...' \
  --from-literal=JWT_SECRET='...' \
  --from-literal=REDIS_URL='redis://...' \
  -n eduai-staging
```

## Step 3: Deploy Services

```bash
kubectl apply -f infrastructure/kubernetes/namespace.yaml
kubectl apply -f infrastructure/kubernetes/configmap.yaml
kubectl apply -f infrastructure/kubernetes/
```

## Step 4: CI/CD

Push to `master` triggers `.github/workflows/deploy.yml`:
1. Build + test
2. Push images to ECR
3. Apply K8s manifests
4. Smoke test health endpoints

## Step 5: Verify

```bash
curl https://staging.eduai.in/api/v1/health
curl https://admin.staging.eduai.in/api/v1/health
```

## Rollback

```bash
kubectl rollout undo deployment/identity-service -n eduai-staging
git tag v0.9.0-beta  # previous known-good
```
