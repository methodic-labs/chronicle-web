const PACKAGE = require('../../package.json');

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.js',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/config/',
    '<rootDir>/flow-typed/',
  ],
  globals: {
    __AUTH0_CLIENT_ID__: '__MISSING__',
    __AUTH0_DOMAIN__: '__MISSING__',
    __ENV_DEV__: false,
    __ENV_PROD__: false,
    __PACKAGE__: PACKAGE.name,
    __VERSION__: PACKAGE.version,
  },
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/config/jest/__mocks__/styleMock.js',
    '\\.(png|svg)$': '<rootDir>/config/jest/__mocks__/fileMock.js',
    'core-js/library/fn/array/fill': '<rootDir>/node_modules/core-js-pure/features/array/fill',
    'core-js/library/fn/array/includes': '<rootDir>/node_modules/core-js-pure/features/array/includes',
  },
  modulePathIgnorePatterns: [
    '<rootDir>/build/',
    '<rootDir>/flow-typed/',
  ],
  rootDir: '../..',
  setupFiles: [
    '<rootDir>/config/jest/enzyme.config.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/config/jest/jest.setup.js'],
  testEnvironment: '<rootDir>/config/jest/jsdom.config.js',
  testURL: 'http://localhost',
  transform: {
    '^.+\\.jsx?$': '<rootDir>/config/jest/babelJestTransformer.js',
  },
};
