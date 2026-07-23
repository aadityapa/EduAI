#!/usr/bin/env node
/**
 * Contract smoke: ensure committed OpenAPI snapshots (or live /api/docs-json)
 * expose expected paths for frontend clients.
 *
 * Mode A (CI default): validate static fixtures under ./fixtures/*.json
 * Mode B (live): set CONTRACT_LIVE=true and services running — fetch docs-json
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(__dirname, 'fixtures');

/** Minimal required paths per service (frontend depends on these). */
const REQUIRED = {
  'identity-service': ['/api/v1/auth/login', '/api/v1/health'],
  'learning-service': ['/api/v1/health'],
  'billing-service': ['/api/v1/health'],
  'ai-service': ['/api/v1/health'],
  'erp-service': ['/api/v1/health'],
};

function collectPaths(doc) {
  const paths = new Set();
  for (const p of Object.keys(doc.paths ?? {})) {
    paths.add(p);
    // Also accept without global prefix variants
    if (p.startsWith('/api/v1')) paths.add(p);
    else paths.add(`/api/v1${p.startsWith('/') ? p : `/${p}`}`);
  }
  return paths;
}

function assertPaths(service, doc) {
  const paths = collectPaths(doc);
  const required = REQUIRED[service] ?? [];
  const missing = [];
  for (const need of required) {
    const ok =
      paths.has(need) ||
      paths.has(need.replace(/^\/api\/v1/, '')) ||
      [...paths].some((p) => p.endsWith(need.replace(/^\/api\/v1/, '')) || p === need);
    if (!ok) missing.push(need);
  }
  if (missing.length) {
    throw new Error(`${service}: missing OpenAPI paths: ${missing.join(', ')}`);
  }
  console.log(`✓ ${service}: ${required.length} required paths present (${paths.size} total)`);
}

async function liveFetch() {
  const ports = {
    'identity-service': 3001,
    'learning-service': 3003,
    'ai-service': 3004,
    'erp-service': 3005,
    'billing-service': 3006,
  };
  for (const [service, port] of Object.entries(ports)) {
    const url = `http://localhost:${port}/api/docs-json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
    const doc = await res.json();
    assertPaths(service, doc);
  }
}

function fixtureMode() {
  if (!existsSync(fixturesDir)) {
    throw new Error(`No fixtures at ${fixturesDir}`);
  }
  const files = readdirSync(fixturesDir).filter((f) => f.endsWith('.json'));
  if (files.length === 0) throw new Error('No OpenAPI fixture JSON files');
  for (const file of files) {
    const service = file.replace(/\.openapi\.json$/, '').replace(/\.json$/, '');
    const doc = JSON.parse(readFileSync(join(fixturesDir, file), 'utf8'));
    assertPaths(service, doc);
  }
}

async function main() {
  if (process.env.CONTRACT_LIVE === 'true') {
    await liveFetch();
  } else {
    fixtureMode();
  }
  console.log('Contract verification passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
