const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          module: "esnext",
          target: "es2022",
          moduleResolution: "node",
          types: ["jest", "node", "@testing-library/jest-dom"],
        },
      },
    ],
  },
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};