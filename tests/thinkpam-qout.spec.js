import {test,expect} from '@playwright/test';
import {QoutPage} from '../pages/qoutPage';

test.describe('Quotes to scrape tests', () => {
    let qoutPage;  
        
    test.beforeEach(async ({page}) => {
        qoutPage = new QoutPage(page);
        await qoutPage.goto();
    });    

    test('get the quote and author', async () => {
        const {quoteText, quoteAuthor} =  await qoutPage.getQuotes(4);
        console.log(`Quote: ${quoteText}`);
        console.log(`Author: ${quoteAuthor}`);

    });    
});
