import { CartPageLocators } from '../Locators/CartPageLocators';

exports.CartPage = class CartPage {
    constructor(page) {
        this.page = page;
    }

    getCartItem(productName) {
        return this.page.locator(CartPageLocators.cartItems).filter({ hasText: productName });
    }

    // getCartItemAction Button
    getCartItemActionButton(productName) {
        return this.getCartItem(productName).getByRole('button');
    }

    async getCartItemNames() {
        const cartItems = await this.page.locator(CartPageLocators.cartItemNames).allTextContents();
        return cartItems.map((item) => item.trim());
    }

    async removeProduct(productName) {
        await this.getCartItemActionButton(productName).click();
    }

    async continueShopping() {
        await this.page.locator(CartPageLocators.continueShoppingButton).click();
    }

    async goToCheckout() {
        await this.page.locator(CartPageLocators.checkoutButton).click();
    }
};