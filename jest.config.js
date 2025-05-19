module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!**/test/**'
  ],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}