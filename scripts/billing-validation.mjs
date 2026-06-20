#!/usr/bin/env node
/**
 * Billing flow validation checklist runner (dev/staging).
 * Usage: node scripts/billing-validation.mjs [--base http://localhost:3006]
 */
const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:3006';

const checks = [];

async function run(name, fn) {
  try {
    await fn();
    checks.push({ name, status: 'PASS' });
    console.log(`✓ ${name}`);
  } catch (err) {
    checks.push({ name, status: 'FAIL', error: String(err) });
    console.error(`✗ ${name}: ${err}`);
  }
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

await run('Health endpoint reachable', async () => {
  const { status } = await get('/api/v1/health');
  if (status !== 200) throw new Error(`Expected 200, got ${status}`);
});

await run('Readiness probe with DB', async () => {
  const { status } = await get('/api/v1/health/ready');
  if (status !== 200) throw new Error(`Expected 200, got ${status}`);
});

await run('Plans endpoint structure', async () => {
  const { status, body } = await get('/api/v1/plans');
  if (status !== 401 && status !== 200) throw new Error(`Unexpected ${status}`);
  if (status === 200 && !body.data) throw new Error('Missing data envelope');
});

await run('Webhook routes exist (401 without signature)', async () => {
  const res = await fetch(`${BASE}/api/v1/webhooks/stripe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'invoice.paid' }),
  });
  if (res.status === 404) throw new Error('Stripe webhook route missing');
});

await run('Razorpay webhook route exists', async () => {
  const res = await fetch(`${BASE}/api/v1/webhooks/razorpay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'payment.captured' }),
  });
  if (res.status === 404) throw new Error('Razorpay webhook route missing');
});

console.log('\n--- Summary ---');
const failed = checks.filter((c) => c.status === 'FAIL');
console.log(`Passed: ${checks.length - failed.length}/${checks.length}`);
if (failed.length) process.exit(1);
