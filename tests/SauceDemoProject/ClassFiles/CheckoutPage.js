import { CheckoutPageLocators } from '../Locators/CheckoutPageLocators';

exports.CheckoutPage = class CheckoutPage {
    constructor(page) {
        this.page = page;
    }

    async fillCheckoutInformation(firstName, lastName, postalCode) {
        await this.page.locator(CheckoutPageLocators.firstNameTextBox).fill(firstName);
        await this.page.locator(CheckoutPageLocators.lastNameTextBox).fill(lastName);
        await this.page.locator(CheckoutPageLocators.postalCodeTextBox).fill(postalCode);
    }

    async continueCheckout() {
        await this.page.locator(CheckoutPageLocators.continueButton).click();
    }

    async finishCheckout() {
        await this.page.locator(CheckoutPageLocators.finishButton).click();
    }

    async completeCheckout(firstName, lastName, postalCode) {
        await this.fillCheckoutInformation(firstName, lastName, postalCode);
        await this.continueCheckout();
        await this.finishCheckout();
    }

    async getCheckoutErrorMessage() {
        return this.page.locator(CheckoutPageLocators.errorMessage).textContent();
    }
};