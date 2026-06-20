import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@eduai/ui', '@eduai/auth', '@eduai/shared'],
  experimental: {
    optimizePackageImports: ['@eduai/ui', 'lucide-react'],
  },
};

export default nextConfig;
