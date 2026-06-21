import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
require('@next/env').loadEnvConfig(rootDir);

const adminPublicUrl = (
  process.env.AUTH_URL_ADMIN ??
  process.env.NEXT_PUBLIC_ADMIN_URL ??
  'http://localhost:3002'
).replace(/0\.0\.0\.0/g, 'localhost');
process.env.AUTH_URL = adminPublicUrl;
process.env.NEXTAUTH_URL = adminPublicUrl;

const nextConfig: NextConfig = {
  transpilePackages: ['@eduai/ui', '@eduai/auth', '@eduai/shared'],
};

export default nextConfig;
