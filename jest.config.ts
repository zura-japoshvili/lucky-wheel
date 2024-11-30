import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'], 
  collectCoverage: true, 
  collectCoverageFrom: ['src/**/*.{ts,js}'], 
  coverageDirectory: 'coverage', 
  coverageReporters: ['text', 'lcov'], 
};

export default config;
