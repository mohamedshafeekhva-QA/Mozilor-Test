// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  reporter: [['html', { outputFolder: 'playwright-report', open: 'always' }]],
  timeout: 80000,
  workers: 1,
  
  use: {
    
    trace: 'on',
    headless : false,
    screenshot : 'on',
    video: 'retain-on-failure',
    actionTimeout: 10*60000,
  },
  

  projects: [
    {
      name: 'chromium',
      use: {
            viewport: null,
            launchOptions: {
                args: ['--start-maximized'],
          },
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

