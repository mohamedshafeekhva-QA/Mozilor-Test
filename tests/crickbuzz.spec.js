import {test,expect} from '@playwright/test';
const fs = require('fs');

test.describe('perform few test in cricbuzz page', async()=>{

    test('validate the url and get access the team list and write it into an json file', async({page})=>{
        await page.goto("https://www.cricbuzz.com/");
        await expect(page).toHaveURL(/https:\/\/www\.cricbuzz\.com\//);

        await page.hover("(//a[@href='/cricket-team'])[2]");
        await page.waitForSelector("//a[contains(text(),'Test Teams')]");
        
        const testTeams = page.locator("//a[contains(text(),'Test Teams')]/parent::div//div//a");
        const teamCount = await testTeams.count();
        
        let teams = [];
        for(let i=0; i<teamCount; i++){
            const teamName = await testTeams.nth(i).textContent();
            await teams.push(teamName.trim());
        }

        fs.writeFileSync('testTeams.json', JSON.stringify(teams, null, 2));

        await console.log("Total Test teams: "+teamCount +"and team names are: "+teams);

        // await page.locator(`//a[contains(text(),'Test Teams')]/parent::div//div//a[contains(text(),'${teams[0]}')]`).click();
        // await expect(page.locator("//main/div[1]/h1/div/h1")).toHaveText(teams[0].toLowerCase());
        // await page.screenshot({path: `screenshots/${teams[0]}_page.png`});     

    })

    test("naviagte to each team page and capture the screenshot", async({page})=>{
        const data = fs.readFileSync('testTeams.json');
        const teams = JSON.parse(data); 

        for(const team of teams){
            await page.goto("https://www.cricbuzz.com/");
            await page.hover("(//a[@href='/cricket-team'])[2]");
            await page.waitForSelector("//a[contains(text(),'Test Teams')]");
            await page.locator(`//a[contains(text(),'Test Teams')]/parent::div//div//a[contains(text(),'${team}')]`).click();
            await expect(page.locator("//main/div[1]/h1/div/h1")).toHaveText(team.toLowerCase());
            await page.screenshot({path: `screenshots/${team}_page.png`});
        }
    });
})