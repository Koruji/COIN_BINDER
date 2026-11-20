// Runs unit AND integration tests in one Jest run so that the coverage
// report (and its thresholds) counts both. Coverage settings are reused
// from the "jest" key of package.json.
const { jest: base } = require("./package.json");
const integration = require("./jest.integration.config.js");

module.exports = {
  testTimeout: base.testTimeout,
  collectCoverageFrom: base.collectCoverageFrom,
  coverageThreshold: base.coverageThreshold,
  projects: [
    {
      displayName: "unit",
      preset: base.preset,
      testPathIgnorePatterns: ["/node_modules/", "<rootDir>/tests/integration/"],
    },
    {
      displayName: "integration",
      ...integration,
    },
  ],
};
