#!/usr/bin/env node
/**
 * Disaster recovery drill checklist (manual steps + automated pre-checks).
 * Usage: node scripts/dr-test-checklist.mjs
 */
const steps = [
  { id: 'DR-1', action: 'Verify latest RDS snapshot exists (<24h for beta RPO)', automated: false },
  { id: 'DR-2', action: 'Confirm S3 versioning enabled on content buckets', automated: false },
  { id: 'DR-3', action: 'Validate DATABASE_URL secret in K8s matches primary RDS', automated: false },
  { id: 'DR-4', action: 'Run restore-db-instance-from-db-snapshot to staging', automated: false },
  { id: 'DR-5', action: 'Apply migrations on restored DB and run smoke tests', automated: false },
  { id: 'DR-6', action: 'Document RTO/RPO achieved in docs/operations/dr-test-report.md', automated: false },
];

console.log('# EduAI DR Test Checklist\n');
for (const step of steps) {
  console.log(`[ ] ${step.id}: ${step.action}`);
}
console.log('\nAutomated pre-check: all service health endpoints');
const services = [
  { name: 'identity', url: process.env.IDENTITY_URL ?? 'http://localhost:3001' },
  { name: 'learning', url: process.env.LEARNING_URL ?? 'http://localhost:3003' },
  { name: 'ai', url: process.env.AI_URL ?? 'http://localhost:3004' },
  { name: 'erp', url: process.env.ERP_URL ?? 'http://localhost:3005' },
  { name: 'billing', url: process.env.BILLING_URL ?? 'http://localhost:3006' },
];

let failures = 0;
for (const svc of services) {
  try {
    const res = await fetch(`${svc.url}/api/v1/health`);
    const ok = res.status === 200;
    console.log(`${ok ? '✓' : '✗'} ${svc.name}-service health: ${res.status}`);
    if (!ok) failures += 1;
  } catch (err) {
    console.log(`✗ ${svc.name}-service health: unreachable (${err})`);
    failures += 1;
  }
}
process.exit(failures > 0 ? 1 : 0);
