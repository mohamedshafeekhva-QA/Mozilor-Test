/**
 * @file LandingPage.js
 * @description Page Object Model (POM) for the Advantage Online Shopping Landing Page.
 * This class provides reusable methods to interact with the main landing page of the application,
 * such as user login verification, sign-out operations, and navigation to product categories.
 */

import { expect } from "@playwright/test";

/**
 * Represents the Advantage Online Shopping Landing Page.
 * Provides locators and actions for UI interactions and verifications.
 */
class LandingPage {
    
    constructor(page){
        this.page = page;

        // User-related elements
        this.userIcon = page.locator('id=hrefUserIcon');
        this.menuUserLink = page.locator('id=menuUserLink');
        this.signOutLabel = page.locator("//div[@id='loginMiniTitle']//following::label[contains(text(),'Sign out')]");
        this.successUserLabel = page.locator("//a[@id='menuUserLink']//span");

        // Page elements
        this.loader = "(//div[@class='loader'])[1]";
        this.seeOfferButton = "//button[@id='see_offer_btn']";

        // Product section elements
        this.productSpeakersShopNowLink = page.locator("//label[@id='speakersLink']");
    }

    /**
     * Navigates to the application’s landing page and waits for it to load completely.
     */
    async goto(){
        await this.page.goto('https://www.advantageonlineshopping.com/#/');
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Clicks the user icon on the landing page.
     * Waits until the page and relevant elements are fully loaded before performing the click.
     */
    async clickUserIcon(){
        await this.page.waitForSelector(this.seeOfferButton);
        await expect(this.userIcon).toBeEnabled();
        await this.userIcon.click();
    }

    /**
     * Verifies that the logged-in user’s name matches the expected username.
     * @param {string} expectedUsername - The expected username to verify.
     */
    async verifyLoggedInUser(expectedUsername){
        await this.page.waitForLoadState();
        await expect(this.successUserLabel).toHaveText(expectedUsername);
    }

    /**
     * Signs out the currently logged-in user and verifies that the username label no longer appears.
     * @param {string} expectedUsername - The username to verify is logged out.
     */
    async signOut(expectedUsername){
        await this.menuUserLink.click();
        await this.signOutLabel.click();
        await this.page.waitForLoadState();
        await expect(this.successUserLabel).not.toHaveText(expectedUsername);
    }

    /**
     * Navigates to the “Speakers” section of the website and verifies the page URL.
     */
    async navigateToSpeakersSection(){
        await this.productSpeakersShopNowLink.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.page.url()).toContain('Speakers');
    }

}

export default LandingPage;
