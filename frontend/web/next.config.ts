import type { NextConfig } from 'next';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
require('@next/env').loadEnvConfig(rootDir);

const webPublicUrl = (
  process.env.AUTH_URL ??
  process.env.NEXT_PUBLIC_WEB_URL ??
  'http://localhost:3000'
).replace(/0\.0\.0\.0/g, 'localhost');
process.env.AUTH_URL = webPublicUrl;
process.env.NEXTAUTH_URL = webPublicUrl;

const nextConfig: NextConfig = {
  transpilePackages: ['@eduai/ui', '@eduai/auth', '@eduai/shared'],
  experimental: {
    optimizePackageImports: ['@eduai/ui', 'lucide-react'],
  },
};

export default nextConfig;
