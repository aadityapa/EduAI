#!/usr/bin/env node
/**
 * Phase 9 CI security helpers:
 * - Fail if obvious secret patterns appear in tracked source (lightweight; gitleaks is primary)
 * - Print pnpm audit summary guidance
 * - Verify SECURITY.md + threat model docs exist
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const failures = [];

const requiredDocs = [
  'SECURITY.md',
  'backend/docs/security/threat-model.md',
  'backend/docs/security/data-residency.md',
  'backend/docs/security/owasp-asvs-checklist.md',
];

for (const doc of requiredDocs) {
  if (!existsSync(join(root, doc))) {
    failures.push(`Missing required security doc: ${doc}`);
  }
}

const SECRET_PATTERNS = [
  { name: 'AWS access key', re: /AKIA[0-9A-Z]{16}/g },
  { name: 'Private key block', re: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
  { name: 'Stripe live secret', re: /sk_live_[0-9a-zA-Z]{20,}/g },
  { name: 'Generic high-entropy api key assignment', re: /(api[_-]?key|secret[_-]?key)\s*=\s*['"][A-Za-z0-9_\-]{32,}['"]/gi },
];

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.next',
  'coverage',
  '.turbo',
  'storybook-static',
]);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|mjs|cjs|json|yml|yaml|env|md|prisma)$/i.test(name)) out.push(p);
  }
  return out;
}

const scanRoots = ['backend', 'frontend', '.github']
  .map((d) => join(root, d))
  .filter((d) => existsSync(d));

for (const base of scanRoots) {
  for (const file of walk(base)) {
    const rel = relative(root, file);
    if (rel.includes('.env') && !rel.endsWith('.example')) {
      failures.push(`Tracked env file should not be committed: ${rel}`);
      continue;
    }
    let text;
    try {
      text = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    for (const { name, re } of SECRET_PATTERNS) {
      re.lastIndex = 0;
      if (re.test(text)) {
        // Allow documented placeholders in .env.example / docs
        if (rel.endsWith('.env.example') || rel.includes('docs/')) continue;
        if (rel.includes('security.test') || rel.includes('ci-security-scan')) continue;
        failures.push(`Possible ${name} in ${rel}`);
      }
    }
  }
}

if (failures.length) {
  console.error('Security scan failed:');
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}

console.log('ci-security-scan: OK (docs present, no obvious hardcoded secrets)');
