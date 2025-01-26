const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  coverageDirectory: 'coverage',
  testTimeout: 10000,
  maxWorkers: '50%',
  retries: 2,
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports',
      outputName: 'jest-junit.xml',
      classNameTemplate: '{filepath}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      suiteNameTemplate: '{filepath}',
      addFileAttribute: 'true',
      reportTestSuiteErrors: true,
      includeConsoleOutput: true,
      includePending: true,
      includeShortConsoleOutput: true,
      usePathForSuiteName: true,
      testLocationInResults: true,
      testRetries: true,
      addTestLocationInfo: true,
      includeFailureMsg: true,
      includeStackTrace: true,
      includeHostname: true,
      includePending: true,
      includeProperties: true,
      properties: {
        'CI': process.env.CI || 'false',
        'TEST_ENV': 'jest',
        'NODE_VERSION': process.version,
        'PLATFORM': process.platform
      }
    }]
  ],
  testResultsProcessor: './node_modules/jest-junit',
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/out/**',
    '!<rootDir>/.next/**',
    '!<rootDir>/*.config.js',
    '!<rootDir>/coverage/**',
  ],
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
  },
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
