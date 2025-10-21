import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jsdom",
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // 👈 añade esta línea

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};

const asyncConfig = async () => {
  const nextJsConfig = await createJestConfig(customJestConfig)();

  return {
    ...nextJsConfig,
    moduleNameMapper: {
      ...nextJsConfig.moduleNameMapper,
      "^@/(.*)$": "<rootDir>/src/$1",
    },
  };
};

export default asyncConfig;
