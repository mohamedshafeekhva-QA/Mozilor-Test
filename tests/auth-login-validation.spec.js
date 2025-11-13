// @file: loginValidation.spec.js
// @description:
// This test suite performs **negative login validation** using data-driven testing.
// It reads invalid credential sets from an Excel file and verifies appropriate
// error messages are displayed for each invalid login attempt.

// Imports
import { test, expect } from '@playwright/test';
import LandingPage from '../pages/landingPage';
import LoginPage from '../pages/loginPage';
import { getInvalidLoginData } from '../utils/excelReader';

let invalidLoginCred = [];

// Test suite: Negative login validation
test.describe('@validation Login negative tests with invalid data from Excel', () => {

  /**
   * beforeAll Hook:
   * - Executes once before all tests in this suite.
   * - Reads invalid login test data from Excel (invalidLoginData.xlsx, Sheet1)
   *   and stores it in the 'invalidLoginCred' array.
   */
  test.beforeAll(async () => {
    invalidLoginCred = await getInvalidLoginData('invalidLoginData.xlsx', 'Sheet1');
  });

  /**
   * Test Case: Data-driven login tests
   * Objective:
   * - Iterate over each invalid credential set from Excel.
   * - Try logging in and verify correct error messages.
   *
   * Test Data Columns (Expected):
   * - email
   * - password
   * - errorMessage
   *
   * Steps:
   *  1. Navigate to the landing page.
   *  2. Enter login credentials (email & password).
   *  3. If fields are empty, verify inline field validation.
   *  4. Otherwise, attempt login and verify main error message.
   */
  test('Data-driven login tests', async ({ page }) => {
    for (const data of invalidLoginCred) {
      console.log('Testing with data set:', data);

      const landingPage = new LandingPage(page);
      const loginPage = new LoginPage(page);

      // Step 1: Open the application
      await landingPage.goto();

      // Step 2: Enter invalid credentials
      await loginPage.fillLoginDetails(data.email, data.password);

      // Step 3: Verify error handling based on input condition
      if (!data.email || !data.password) {
        // Case: Empty field validation error
        await loginPage.verifyFieldErrorMessage(data.errorMessage);
      } else {
        // Case: Invalid credentials (e.g., wrong email/password)
        await loginPage.signIn();
        await loginPage.verifyMainErrorMessage(data.errorMessage);
      }
    }
  });
});
