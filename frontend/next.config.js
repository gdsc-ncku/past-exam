const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname);

    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test && rule.test.test?.('.svg'),
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    // 2) Add a new rule for SVGR
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    // PDF.js configuration
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    // Handle PDF.js worker on client side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        canvas: false,
      };
    }

    return config;
  },
  experimental: {
    outputFileTracingRoot: path.resolve(__dirname),
    outputFileTracingIncludes: {
      '/**/*': ['./.next/static/**/*', './public/**/*'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
    ],
    domains: ['lh3.googleusercontent.com', 'localhost'],
  },
};

module.exports = nextConfig;
