// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['js', 'jsx'],
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest'
    },
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  };
  