// @file: auth-signup-and-login.spec.js
// @description: 
// This test suite verifies user signup, login, and logout functionality 
// for the web application using Playwright. It includes:
//  1. Creating a new user and signing up.
//  2. Logging in with valid credentials and logging out.

// Imports from Playwright test runner
import { test, expect } from '@playwright/test';

// Page Object imports
import LandingPage from '../pages/landingPage';
import LoginPage from '../pages/loginPage';
import SignupPage from '../pages/singupPage';

// Utility imports
import { generateUser } from '../utils/datagenerator';
import fs from 'fs';

// Test suite for signup and login functionality
test.describe('@signup  Access the application and signup as a new user', () => {  

    /**
     * Test Case 1:
     * Verify that a new user can successfully register and log out.
     * Steps:
     *  1. Navigate to the landing page.
     *  2. Click on “Create New Account”.
     *  3. Fill in registration details using generated user data.
     *  4. Agree to terms and submit the registration form.
     *  5. Verify that the user is logged in successfully.
     *  6. Log out and verify sign-out.
     */
    test('signup as new user and logout', async ({ page }) => {
        let landingPage = new LandingPage(page);
        let loginPage = new LoginPage(page);
        let signupPage = new SignupPage(page);
        const newUser = generateUser(); // dynamically generate test user data

        await landingPage.goto();
        await loginPage.clickOnCreateNewAccount();
        await signupPage.fillTheNewUserDetails(newUser);
        await signupPage.agreeToTermsAndRegister();
        await landingPage.verifyLoggedInUser(newUser.username);
        await landingPage.signOut(newUser.username);
    });

    /**
     * Test Case 2:
     * Verify that an existing user can log in with valid credentials and log out.
     * Steps:
     *  1. Navigate to the landing page.
     *  2. Log in using credentials stored in test-data/latestUser.json.
     *  3. Verify successful login.
     *  4. Log out and confirm sign-out.
     */
    test('Login to the application with valid credential and perform logout', async ({ page }) => {
        let landingPage = new LandingPage(page);
        let loginPage = new LoginPage(page);

        // Load the most recently created user credentials
        const creds = JSON.parse(fs.readFileSync('./test-data/latestUser.json', 'utf-8'));

        await landingPage.goto();
        await loginPage.fillLoginDetails(creds.username, creds.password);
        await loginPage.signIn();
        await landingPage.verifyLoggedInUser(creds.username);
        await landingPage.signOut(creds.username);        
    });

});
