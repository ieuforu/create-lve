import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    ENABLE_RSC_VISUALIZER: isDev ? 'true' : 'false',
  },
}

export default nextConfig
