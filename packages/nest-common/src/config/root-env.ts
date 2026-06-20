import { join } from 'path';

/** Resolve monorepo root `.env` when services run from `services/*`. */
export function rootEnvFilePaths(): string[] {
  const cwd = process.cwd();
  return [
    join(cwd, '../../.env'),
    join(cwd, '../../../.env'),
    join(cwd, '.env'),
  ];
}

export const rootConfigModuleOptions = {
  isGlobal: true,
  envFilePath: rootEnvFilePaths(),
} as const;
