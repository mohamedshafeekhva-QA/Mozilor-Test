/**
 * @file orderPaymentPage.js
 * @description 
 * This class handles all actions and verifications related to the checkout process,
 * including verifying order details, entering payment information, completing a transaction,
 * and validating messages for both logged-in and guest users.
 */

import { expect } from "@playwright/test";

/**
 * Represents the Order Payment Page.
 * Provides reusable methods for verifying user and order details,
 * handling payment flows, and confirming order success.
 */
class OrderPaymentPage {

  constructor(page) {
    this.page = page;

    // Navigation elements
    this.navigationTitle = page.locator("(//nav[contains(@class,'fixedImportant ')]//a)[3]");

    // User details section
    this.fullNameText = page.locator("(//div[@id='userDetails']//div//label)[1]");
    this.addressText = page.locator("(//div[@id='userDetails']//div//label)[2]");
    this.cityText = page.locator("(//div[@id='userDetails']//div//label)[3]");
    this.countryText = page.locator("(//div[@id='userDetails']//div//label)[4]");
    this.stateText = page.locator("(//div[@id='userDetails']//div//label)[5]");
    this.zipcodeText = page.locator("(//div[@id='userDetails']//div//label)[6]");
    this.contactNumberText = page.locator("(//div[@id='userDetails']//div//label)[7]");

    // Product and price section
    this.productPriceText = page.locator("(//p[contains(@class,'price ')])[2]");

    // Navigation and payment elements
    this.nextButton = page.locator("(//button[@id='next_btn'])[1]");
    this.masterCreditRadioButton = page.locator("//input[@name='masterCredit']");
    this.cardNumberInput = page.locator("//input[@name='card_number']");
    this.cvvNumberInput = page.locator("//input[@name='cvv_number']");
    this.cardholderNameInput = page.locator("//input[@name='cardholder_name']");
    this.payNowButton = page.locator("//button[@id='pay_now_btn_ManualPayment']");

    // Order confirmation
    this.orderPaymentSuccessMessage = page.locator("//div[@id='orderPaymentSuccess']//h2/span");

    // Guest user prompt
    this.orderPaymentPageLoginFold = page.locator("//div[@class='noUserSection']");

    // Default / expected values
    this.expectedNavigationTitle = "ORDER PAYMENT";
    this.cardNumber = "488348834883";
    this.cvvNumber = "123";
    this.cardholderName = "Test User";
    this.expectedOrderPaymentSuccessMessage = "Thank you for buying with Advantage";
  }

  /**
   * Verifies that the user has successfully navigated to the Order Payment page.
   * Checks the page URL and navigation title.
   */
  async verifyNavigatedToOrderPaymentPage() {
    await expect(this.page).toHaveURL(/.*orderPayment/);
    await expect(this.navigationTitle).toHaveText(this.expectedNavigationTitle);
  }

  /**
   * Verifies the user’s details displayed on the Order Payment page.
   */
  async verifyUserDetailsInOrderPaymentPage(expectedUser) {
    const fullName = await this.fullNameText.textContent();
    await expect(fullName).toContain(expectedUser.firstName);
    await expect(fullName).toContain(expectedUser.lastName);

    const address = await this.addressText.textContent();
    await expect(address).toContain(expectedUser.address);

    const city = await this.cityText.textContent();
    await expect(city).toContain(expectedUser.city);

    const state = await this.stateText.textContent();
    await expect(state).toContain(expectedUser.state);

    const zipcode = await this.zipcodeText.textContent();
    await expect(zipcode).toContain(expectedUser.postalCode);

    const contactNumber = await this.contactNumberText.textContent();
    await expect(contactNumber).toContain(expectedUser.phoneNumber);
  }

  /**
   * Verifies that the product price displayed on the Order Payment page matches the expected value.
   */
  async verifyProductPriceInOrderPaymentPage(expectedPriceText) {
    const productPrice = (await this.productPriceText.textContent()).trim();
    console.log("Product price in Order Payment Page:", productPrice);
    const cleanedExpectedPrice = expectedPriceText.replace(/\s+/g, ' ').trim().split(' ')[0];
    await expect(productPrice).toContain(cleanedExpectedPrice);
  }

  /**
   * Proceeds from the order details to the payment method section.
   * Waits for the page to fully load after clicking.
   */
  async proceedToPaymentMethod() {
    await expect(this.nextButton).toBeEnabled();
    await this.nextButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Selects the "Master Credit" payment option.
   */
  async selectMasterCreditPaymentMethod() {
    await expect(this.masterCreditRadioButton).toBeVisible();
    await this.masterCreditRadioButton.check();
  }

  /**
   * Fills in credit card details using predefined test data.
   */
  async fillCardDetailsAndPayNow() {
    await this.cardNumberInput.fill(this.cardNumber);
    await this.cvvNumberInput.fill(this.cvvNumber);
    await this.cardholderNameInput.fill(this.cardholderName);
  }

  /**
   * Clicks the "Pay Now" button to complete the payment.
   * Waits for network requests to settle after the click.
   */
  async clickPayNowButton() {
    await expect(this.payNowButton).toBeEnabled();
    await this.payNowButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verifies that the order payment success message is visible and matches the expected text.
   */
  async verifyOrderPaymentSuccessMessage() {
    const successMessage = await this.orderPaymentSuccessMessage.textContent();
    console.log("Order Payment Success Message:", successMessage);
    await expect(this.orderPaymentSuccessMessage).toHaveText(this.expectedOrderPaymentSuccessMessage);
  }

  /**
   * Verifies that the Order Payment page prompts a guest user to log in
   * before proceeding to checkout.
   */
  async verifyLoginFoldForGuestUser() {
    await expect(this.orderPaymentPageLoginFold).toBeVisible();
    await expect(this.page).toHaveURL(/.*login/);
  }
}

export default OrderPaymentPage;
