import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  collectCoverageFrom: [
    'src/app/**/*.{js,jsx,ts,tsx}', // Check all JS/TS/JSX/TSX files under src/app
    '!src/app/**/layout.tsx', // Optional: Exclude files that are difficult/unnecessary to test
    '!src/app/**/globals.css',
    '!src/app/**/route.ts', // Optional: Exclude API routes
    '!**/*.d.ts', // Standard: Exclude TypeScript definition files
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

const asyncConfig = async () => {
  const nextJsConfig = await createJestConfig(customJestConfig)();

  return {
    ...nextJsConfig,
    moduleNameMapper: {
      ...nextJsConfig.moduleNameMapper,
      '^@/(.*)$': '<rootDir>/src/$1',
    },
  };
};

export default asyncConfig;
