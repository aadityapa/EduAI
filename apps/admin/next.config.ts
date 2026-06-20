import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@eduai/ui', '@eduai/auth', '@eduai/shared'],
};

export default nextConfig;
