const path = require('path');
/** @type {import('next').NextConfig} */
const nextConfig = {
    output:'standalone',
    webpack: (config) => {
      config.resolve.alias['@'] = path.resolve(__dirname);
      return config;
    },
    experimental: {
      outputFileTracingRoot: path.resolve(__dirname),
      outputFileTracingIncludes: {
        '/**/*': ['./.next/static/**/*', './public/**/*'],
      }
    }
  };

module.exports = nextConfig;
