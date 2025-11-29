import { th } from '@faker-js/faker';
import {expect} from '@playwright/test';

class QoutPage {
    constructor(page) {
        this.page = page;
        this.pageHeading = page.locator("(//div[@class = 'col-md-8']//h1/a)");
        this.quoteBlock = page.locator("//div[@class='quote']");
    
}

    async goto() {
        await this.page.goto('https://quotes.toscrape.com/');
        await this.page.waitForLoadState('networkidle');
        await expect(this.pageHeading).toHaveText('Quotes to Scrape');
    } 

    async getQuotes(expectedQuote) {
        const quoteText = await this.quoteBlock.nth(expectedQuote - 1).locator('.text').textContent();
        const quoteAuthor = await this.quoteBlock.nth(expectedQuote - 1).locator('.author').textContent();
        return {quoteText, quoteAuthor};
    }
}

export {QoutPage};