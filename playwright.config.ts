import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 2,
  reporter: [["list"], ["allure-playwright"]],
  use: {
    baseURL: process.env.TEST_ENV_URL || "https://qa3.negsim.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    ignoreHTTPSErrors: true,
    navigationTimeout: 60000,
    actionTimeout: 30000,
    launchOptions: {
      slowMo: 50,
    },
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        screenshot: "only-on-failure",
        video: "retain-on-failure",
        trace: "on-first-retry",
      },
    },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },
    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },
  ],
});
