/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle Node.js built-in modules with node: protocol
    config.externals = config.externals || [];
    
    if (!isServer) {
      // Handle client-side fallbacks for Node.js modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        util: false,
        events: false,
        buffer: false,
        process: false,
      };
    }

    // Handle node: protocol imports
    const originalResolve = config.resolve.alias || {};
    config.resolve.alias = {
      ...originalResolve,
      'node:events': 'events',
      'node:util': 'util',
      'node:buffer': 'buffer',
      'node:stream': 'stream',
      'node:crypto': 'crypto',
      'node:fs': false,
      'node:path': 'path',
      'node:os': 'os',
      'node:url': 'url',
    };

    return config;
  },
  transpilePackages: ['@google/genai', '@google/generative-ai'],
};

export default nextConfig;
