import { existsSync } from 'fs';
import { dirname, join } from 'path';

function findMonorepoRoot(startDir: string): string {
  let dir = startDir;
  while (true) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return startDir;
    }
    dir = parent;
  }
}

/** Resolve monorepo root `.env` regardless of package depth. */
export function rootEnvFilePaths(): string[] {
  const root = findMonorepoRoot(process.cwd());
  return [join(root, '.env'), join(root, '.env.local')];
}

export const rootConfigModuleOptions = {
  isGlobal: true,
  envFilePath: rootEnvFilePaths(),
} as const;
