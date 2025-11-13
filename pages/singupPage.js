import { expect } from "@playwright/test";

class SignupPage {
    constructor(page) { 
        this.page = page;

        // --- Registration form fields ---
        this.usernameInput = page.locator("//input[@name='usernameRegisterPage']");
        this.emailInput = page.locator("//input[@name='emailRegisterPage']");
        this.passwordInput = page.locator("//input[@name='passwordRegisterPage']");
        this.confirmPasswordInput = page.locator("//input[@name='confirm_passwordRegisterPage']");
        this.phoneNumberInput = page.locator("//input[@name='phone_numberRegisterPage']");
        this.countrySelect = page.locator("//select[@name='countryListboxRegisterPage']");
        this.cityInput = page.locator("//input[@name='cityRegisterPage']");
        this.addressInput = page.locator("//input[@name='addressRegisterPage']");
        this.stateInput = page.locator("//input[@name='state_/_province_/_regionRegisterPage']");
        this.postalCodeInput = page.locator("//input[@name='postal_codeRegisterPage']");
        this.iAgreeCheckbox = page.locator("//input[@name='i_agree']");
        

        // --- User identity fields ---
        this.firstNameInput = page.locator("//input[@name='first_nameRegisterPage']");
        this.lastNameInput = page.locator("//input[@name='last_nameRegisterPage']");

        // --- Buttons and labels ---
        this.registerButton = page.locator("//button[@id='register_btn']");
        this.successUserLabel = page.locator("//a[@id='menuUserLink']//span");
        this.signOutLabel = page.locator("//div[@id='loginMiniTitle']//following::label[contains(text(),'Sign out')]");
        this.userIcon = page.locator('id=hrefUserIcon');
    }

    /**
     * Fill all fields in the registration form using data from a newUser object.
     */
    async fillTheNewUserDetails(newUser) {
        // Fill account credentials
        await this.usernameInput.fill(newUser.username);
        await this.emailInput.fill(newUser.email); 
        await this.passwordInput.fill(newUser.password);
        await this.confirmPasswordInput.fill(newUser.confirmPassword);

        // Fill personal details
        await this.firstNameInput.fill(newUser.firstName);
        await this.lastNameInput.fill(newUser.lastName);
        await this.phoneNumberInput.fill(newUser.phoneNumber);

        // Fill address and location details
        await this.countrySelect.selectOption(newUser.country);
        await this.cityInput.fill(newUser.city);
        await this.addressInput.fill(newUser.address);
        await this.stateInput.fill(newUser.state);
        await this.postalCodeInput.fill(newUser.postalCode);
    }

    /**
     * Agree to terms and conditions, then click on the Register button.
     */
    async agreeToTermsAndRegister() {
        await this.iAgreeCheckbox.check();                      // Accept terms
        await expect(this.registerButton).toBeEnabled();         // Verify Register button is active
        await this.registerButton.click();                       // Submit registration form
    }
}

export default SignupPage;
