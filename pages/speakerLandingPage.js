import { expect } from "@playwright/test";

class SpeakerLandingPage {
    constructor(page) {
        this.page = page;

        // Locators for elements on the Speaker Landing Page
        this.navigationText = page.locator("//nav[contains(@class,'pages categoryDataFixedNav')]//a[contains(text(),'SPEAKERS')]");
        this.productListingSection = page.locator("//div[@class='cell categoryRight']");
        this.firstSpeakerProduct = page.locator("(//div[@class='cell categoryRight']//ul//li//a)[1]");
        this.navigationTitle = page.locator("(//nav[contains(@class,'fixedImportant ')]//a)[3]");
        this.productTitle = page.locator("//h1[@class='roboto-regular screen768 ng-binding']");
        this.productPrice = page.locator("(//div[@id='Description']//h2)[1]");
        this.addToCartButton = page.locator("//button[@name='save_to_cart']");
        this.cartPopupProductPrice = page.locator("//p[contains(@class,'price ')]");
        this.cartPopup = page.locator("//li//*[@id='toolTipCart']");
        this.checkoutProductButton = page.locator("//li//*[@id='checkOutPopUp']");
    }

    // ✅ Verify that the user is on the Speaker landing page
    async verifySpeakerLandingPage() {
        await expect(this.navigationText).toHaveText('SPEAKERS');
        await expect(this.productListingSection).toBeVisible();
    }

    // 🔍 Get the name of the first listed speaker product
    async getFirstSpeakerProductName() {
        const productName = await this.firstSpeakerProduct.textContent();
        console.log("First Speaker Product Name: " + productName);
        return productName;
    }

    // 🖱️ Select the first speaker product to open its details page
    async selectFirstSpeakerProduct() {
        await this.firstSpeakerProduct.click();
        await this.page.waitForLoadState('networkidle');
    }

    // 💰 Fetch and return the price of the selected speaker product
    async getSpeakerProductPrice() {
        const priceText = await this.productPrice.textContent();
        console.log("Speaker Product Price: " + priceText);
        return priceText;
    }

    // ✅ Verify that product details (name, title, navigation) match the expected product
    async verifySpeakerProductDetails(expectedProductName) {
        const actualNavText = await this.navigationTitle.textContent();
        const actualProductTitle = await this.productTitle.textContent();

        expect(actualNavText.trim().toLowerCase()).toBe(expectedProductName.trim().toLowerCase());
        expect(actualProductTitle.trim().toLowerCase()).toBe(expectedProductName.trim().toLowerCase());

        console.log("Speaker Product Details verified successfully: " + expectedProductName);
        await expect(this.productPrice).toBeVisible();
    }

    // 🛒 Add the selected speaker product to the cart
    async addSpeakerProductToCart() {
        await expect(this.addToCartButton).toBeEnabled();
        await this.addToCartButton.click();
    }

    // 🧾 Verify that the product added to cart matches the displayed price
    async verifyProductAddedToCart(priceText) {
        await expect(this.cartPopup).toBeVisible();
        await expect(this.cartPopupProductPrice).toBeVisible();

        const cartProductPrice = await this.cartPopupProductPrice.textContent();
        const cleanedText = cartProductPrice.replace(/\s+/g, ' ').trim();
        const extractedPrice = priceText.match(/\$\d+(\.\d+)?/)[0];

        console.log("Product price in cart popup: " + cleanedText);
        expect(cleanedText).toContain(extractedPrice);
    }

    // 💳 Proceed to the checkout page from the cart popup
    async proceedToCheckout() {
        await expect(this.checkoutProductButton).toBeEnabled();
        await this.checkoutProductButton.click();
        await this.page.waitForLoadState('networkidle');
    }
}

export default SpeakerLandingPage;
