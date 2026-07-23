/**
 * Fetch OpenAPI JSON from running Nest services and generate typed clients
 * into `frontend/shared-ui/api-clients/` (openapi-typescript).
 *
 * Prerequisites: services listening locally (or set *_SERVICE_URL env vars).
 *
 *   pnpm openapi:generate
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const outDir = join(root, 'frontend/shared-ui/api-clients');

const SERVICES = [
  { name: 'identity', port: 3001, env: 'NEXT_PUBLIC_IDENTITY_SERVICE_URL' },
  { name: 'learning', port: 3003, env: 'NEXT_PUBLIC_LEARNING_SERVICE_URL' },
  { name: 'ai', port: 3004, env: 'NEXT_PUBLIC_AI_SERVICE_URL' },
  { name: 'erp', port: 3005, env: 'NEXT_PUBLIC_ERP_SERVICE_URL' },
  { name: 'billing', port: 3006, env: 'NEXT_PUBLIC_BILLING_SERVICE_URL' },
];

async function fetchSpec(baseUrl: string): Promise<object> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/docs-json`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as object;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const results = [];

  for (const svc of SERVICES) {
    const base =
      process.env[svc.env] ??
      process.env[`${svc.name.toUpperCase()}_SERVICE_URL`] ??
      `http://localhost:${svc.port}`;

    try {
      const spec = await fetchSpec(base);
      const specPath = join(outDir, `${svc.name}.openapi.json`);
      await writeFile(specPath, JSON.stringify(spec, null, 2), 'utf8');

      const typesPath = join(outDir, `${svc.name}.ts`);
      const gen = spawnSync(
        'pnpm',
        ['exec', 'openapi-typescript', specPath, '-o', typesPath],
        { cwd: root, shell: true, encoding: 'utf8' },
      );
      if (gen.status !== 0) {
        console.warn(`[${svc.name}] openapi-typescript failed:`, gen.stderr || gen.stdout);
        results.push({ service: svc.name, ok: false, reason: 'codegen' });
        continue;
      }
      console.log(`✓ ${svc.name} → ${typesPath}`);
      results.push({ service: svc.name, ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`✗ ${svc.name}: ${message}`);
      results.push({ service: svc.name, ok: false, reason: message });
    }
  }

  const index = [
    '/** Auto-generated index — run `pnpm openapi:generate` */',
    ...SERVICES.map((s) => `export type * as ${s.name} from './${s.name}.js';`),
    '',
  ].join('\n');
  await writeFile(join(outDir, 'index.ts'), index, 'utf8');

  const failed = results.filter((r) => !r.ok);
  if (failed.length === SERVICES.length) {
    console.error(
      '\nNo specs fetched. Start backend services (pnpm dev:backend) then re-run.',
    );
    process.exitCode = 1;
  } else if (failed.length) {
    console.warn(`\nPartial success: ${failed.length} service(s) skipped.`);
  } else {
    console.log('\nAll OpenAPI clients generated.');
  }
}

main();
