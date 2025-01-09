const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
    output:'standalone',
    webpack: (config) => {
      config.resolve.alias['@'] = path.resolve(__dirname);

      const fileLoaderRule = config.module.rules.find(
        (rule) => rule.test && rule.test.test?.('.svg')
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
      
      return config;
    },
    experimental: {
      outputFileTracingRoot: path.resolve(__dirname),
      outputFileTracingIncludes: {
        '/**/*': ['./.next/static/**/*', './public/**/*'],
      }
    }
  };

module.exports = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  onDevelopment: () => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn(
        'Warning: NEXT_PUBLIC_API_URL is not set, using default value',
      );
    }
  },
};
