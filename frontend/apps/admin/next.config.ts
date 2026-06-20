import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
require('@next/env').loadEnvConfig(rootDir);

const nextConfig: NextConfig = {
  transpilePackages: ['@eduai/ui', '@eduai/auth', '@eduai/shared'],
};

export default nextConfig;
