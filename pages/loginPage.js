/**
 * @file LoginPage.js
 * @description Page Object Model (POM) for the Login Page of the Advantage Online Shopping application.
 * This class encapsulates all selectors and actions related to user login,
 * including form validation, error handling, and navigation to account creation.
 */

import { expect } from "@playwright/test";
import LandingPage from "../pages/landingPage";

class LoginPage {

  /**
   * Initializes a new instance of the LoginPage class.
   * @param {import('@playwright/test').Page} page - The Playwright page instance.
   */
  constructor(page) {
    this.page = page;

    // Login form fields
    this.usernameInput = page.locator("//input[@name='username']");
    this.passwordInput = page.locator("//input[@name='password']");
    this.signInButton = page.locator("#sign_in_btn");
    this.mainLoader = page.locator("(//div[@class='loader'])[1]");

    // Navigation and links
    this.createNewAccountLink = page.locator("//a[contains(text(),'CREATE NEW ACCOUNT')]");

    // Error message elements
    this.fieldValidationMessage = page.locator("//label[@class='invalid']");
    this.loginValidationMessage = page.locator("//label[@id='signInResultMessage']");

    // Popup close button
    this.popupCoseButton = page.locator("//div[@class='closeBtn loginPopUpCloseBtn']");
  }

  /**
   * Fills in the username and password fields on the login popup.
   * Automatically opens the login popup via the landing page’s user icon.
   * @param {string} username - The username to input (can be empty).
   * @param {string} password - The password to input (can be empty).
   */
  async fillLoginDetails(username, password) {
    const landingPage = new LandingPage(this.page);
    await landingPage.clickUserIcon();
    await expect(this.signInButton).toBeDisabled(); // Ensure button is disabled before filling
    await this.usernameInput.fill(username || '');
    await this.passwordInput.fill(password || '');
  }

  /**
   * Clicks the "Sign In" button to attempt login.
   * Should be called after filling the username and password.
   */
  async signIn() {
    await this.signInButton.click();
    await this.mainLoader.waitFor({ state: 'hidden' });
  }

  /**
   * Navigates to the "Create New Account" registration page from the login popup.
   * Verifies successful redirection to the registration URL.
   */
  async clickOnCreateNewAccount() {
    const landingPage = new LandingPage(this.page);
    await landingPage.clickUserIcon();
    await this.createNewAccountLink.click();
    await expect(this.page).toHaveURL(/\/register/);
  }

  /**
   * Verifies that the main login error message (e.g., invalid credentials) is visible and correct.
   * Closes the popup and reloads the page afterward for clean test state.
   * @param {string} expectedText - The expected error message text.
   */
  async verifyMainErrorMessage(expectedText) {
    await expect(this.loginValidationMessage).toBeVisible();
    await expect(this.loginValidationMessage).toHaveText(expectedText);
    await this.popupCoseButton.click();
    await this.page.reload({ waitUntil: 'networkidle' });
  }

  /**
   * Verifies that the field-level validation message (e.g., "Username required") is visible and correct.
   * Closes the popup and reloads the page afterward for clean test state.
   * @param {string} expectedText - The expected validation message text.
   */
  async verifyFieldErrorMessage(expectedText) {
    await this.page.keyboard.press('Tab'); // Trigger validation by moving focus
    await expect(this.fieldValidationMessage).toBeVisible();
    await expect(this.fieldValidationMessage).toHaveText(expectedText);
    await this.popupCoseButton.click();
    await this.page.reload({ waitUntil: 'networkidle' });
  }
}

export default LoginPage;
