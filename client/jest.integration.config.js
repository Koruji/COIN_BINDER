module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.integration.setup.js"],
  testMatch: ["<rootDir>/tests/integration/**/*.test.{ts,tsx}"],
};
