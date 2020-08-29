// Do this as the first thing so that any code reading it knows the right env.
// eslint-disable-next-line jest/no-jest-import
import * as jest from 'jest';

process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

// Ensure environment variables are read.
require('../config/env');

const argv = process.argv.slice(2);

// Watch unless on CI or in coverage mode
if (!process.env.CI && !argv.includes('--coverage')) {
  argv.push('--watch');
}

// To prevent slow tests on Docker or CI
// https://jestjs.io/docs/en/troubleshooting#tests-are-extremely-slow-on-docker-andor-continuous-integration-ci-server
argv.push('--runInBand');

jest.run(argv);
