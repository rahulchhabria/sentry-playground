/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [], // Add any external image domains you use
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    NEXT_PUBLIC_SENTRY_RELEASE: process.env.VERCEL_GIT_COMMIT_SHA || "development",
  },
  sentry: {
    hideSourceMaps: true,
    autoInstrumentServerFunctions: true,
  }
};

// Injected content via Sentry wizard below
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: "rc-sentry-projects",
    project: "bolt-sentry-simulator",
    authToken: "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",

    // Add monitoring configuration
    monitor: {
      enabled: true,
      endpoints: [
        {
          name: 'Health Check',
          url: '/api/health',
          interval: '5m',
          timeout: '10s',
        },
      ],
      crons: [
        {
          name: 'Daily Tasks',
          schedule: '0 0 * * *', // Daily at midnight
          endpoint: '/api/cron/daily-tasks',
        },
      ],
    },
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
