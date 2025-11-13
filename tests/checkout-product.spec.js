// @file: checkoutProduct.spec.js
// @description:
// This test suite verifies the **product checkout workflow** for both
// logged-in and guest users. It ensures the correct navigation, 
// product details, cart validation, payment flow, and guest login prompts.

// Imports
import { test, expect } from '@playwright/test';
import LandingPage from '../pages/landingPage';
import LoginPage from '../pages/loginPage';
import SpeakerLandingPage from '../pages/speakerLandingPage';
import OrderPaymentPage from '../pages/orderPaymentPage';
import fs from 'fs';

let landingPage, loginPage, speakerLandingPage, orderPaymentPage;
let userDetails;

/**
 * @hook beforeEach
 * Description:
 * - Initializes page object instances for each page before every test.
 * - Loads the latest registered user details from JSON (if not already loaded).
 * - Navigates to the application landing page.
 */
test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  loginPage = new LoginPage(page);
  speakerLandingPage = new SpeakerLandingPage(page);
  orderPaymentPage = new OrderPaymentPage(page);

  if (!userDetails) {
    userDetails = JSON.parse(fs.readFileSync('./test-data/latestUser.json', 'utf-8'));
  }

  console.log("Navigating to Landing Page...");
  await landingPage.goto();
});

/**
 * @suite Product Checkout Scenarios
 * @tag @checkout
 * Description:
 * - Validates end-to-end checkout flow for both logged-in and guest users.
 * - Includes validation of cart operations, user details, and payment page behaviors.
 */
test.describe('@checkout Product checkout scenarios for both logged-in and guest users', () => {

  /**
   * Test Case 1:
   * Logged-in user: Add product to cart and complete payment
   *
   * Steps:
   *  1. Log in with valid credentials.
   *  2. Navigate to the Speakers section.
   *  3. Select the first speaker product and verify details.
   *  4. Add the product to cart and validate the price.
   *  5. Proceed to checkout and verify user details and price.
   *  6. Choose payment method, enter card details, and complete payment.
   *  7. Verify payment success confirmation message.
   */
  test('Logged-in user: Add product to cart and complete payment', async ({ page }) => {
    // Step 1: Login
    await landingPage.goto();
    await loginPage.fillLoginDetails(userDetails.username, userDetails.password);
    await loginPage.signIn();
    await landingPage.verifyLoggedInUser(userDetails.username);

    // Step 2: Navigate to speakers section
    await landingPage.navigateToSpeakersSection();
    await speakerLandingPage.verifySpeakerLandingPage();

    // Step 3: Select and verify product details
    const expectedSpeakerProductName = await speakerLandingPage.getFirstSpeakerProductName();
    await speakerLandingPage.selectFirstSpeakerProduct();
    await speakerLandingPage.verifySpeakerProductDetails(expectedSpeakerProductName);
    const speakerProductPrice = await speakerLandingPage.getSpeakerProductPrice();

    // Step 4: Add to cart and verify
    await speakerLandingPage.addSpeakerProductToCart();
    await speakerLandingPage.verifyProductAddedToCart(speakerProductPrice);
    await speakerLandingPage.proceedToCheckout();

    // Step 5: Verify order summary and payment page
    await orderPaymentPage.verifyNavigatedToOrderPaymentPage();
    await orderPaymentPage.verifyUserDetailsInOrderPaymentPage(userDetails);
    await orderPaymentPage.verifyProductPriceInOrderPaymentPage(speakerProductPrice);

    // Step 6: Complete payment flow
    await orderPaymentPage.proceedToPaymentMethod();
    await orderPaymentPage.selectMasterCreditPaymentMethod();
    await orderPaymentPage.fillCardDetailsAndPayNow();

    // Step 7: Verify success
    await orderPaymentPage.verifyOrderPaymentSuccessMessage();
  });

  /**
   * Test Case 2:
   * Guest user: Add product to cart and verify login prompt is displayed
   *
   * Steps:
   *  1. Navigate to Speakers section.
   *  2. Select a product and verify product details.
   *  3. Add product to cart and verify price.
   *  4. Proceed to checkout.
   *  5. Verify that login prompt (fold) is displayed for guest user.
   */
  test('Guest user: Add product to cart and verify login prompt is displayed', async ({ page }) => {
    // Step 1: Navigate to speakers section
    await landingPage.navigateToSpeakersSection();
    await speakerLandingPage.verifySpeakerLandingPage();

    // Step 2: Select and verify product details
    const expectedSpeakerProductName = await speakerLandingPage.getFirstSpeakerProductName();
    await speakerLandingPage.selectFirstSpeakerProduct();
    await speakerLandingPage.verifySpeakerProductDetails(expectedSpeakerProductName);
    const speakerProductPrice = await speakerLandingPage.getSpeakerProductPrice();

    // Step 3: Add to cart and proceed to checkout
    await speakerLandingPage.addSpeakerProductToCart();
    await speakerLandingPage.verifyProductAddedToCart(speakerProductPrice);
    await speakerLandingPage.proceedToCheckout();

    // Step 4: Verify login fold (prompt) for guest user
    await orderPaymentPage.verifyLoginFoldForGuestUser();
  });
});
