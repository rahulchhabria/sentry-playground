/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  
  // Add performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Optimize loading performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Minimize JavaScript
  swcMinify: true,
};

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "rc-sentry-projects",
    project: "bolt-sentry-simulator",
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    hideSourceMaps: true,
    disableLogger: true,
  }
);
