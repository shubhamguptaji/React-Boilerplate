module.exports = {
  verbose: true,
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  setupTestFrameworkScriptFile: './src/setupTests.js'
  // testRegex: 'ui_tests/*(\\.test)(\\.js)$'
};
