import { join } from 'path';

function rootEnvCandidates(cwd: string): string[] {
  const roots = [join(cwd, '../..'), join(cwd, '../../..'), cwd];
  const files: string[] = [];
  for (const root of roots) {
    files.push(join(root, '.env'), join(root, '.env.local'));
  }
  return files;
}

/** Resolve monorepo root `.env` when services run from `services/*`. */
export function rootEnvFilePaths(): string[] {
  return rootEnvCandidates(process.cwd());
}

export const rootConfigModuleOptions = {
  isGlobal: true,
  envFilePath: rootEnvFilePaths(),
} as const;
