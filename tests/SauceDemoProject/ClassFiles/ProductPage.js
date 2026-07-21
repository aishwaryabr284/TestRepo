import { ProductPageLocators } from '../Locators/ProductPageLocators';

exports.ProductPage = class ProductPage {

    constructor(page) {
        this.page = page;
    }

    getInventoryItem(productName) {
        return this.page.locator(ProductPageLocators.inventoryItems).filter({ hasText: productName });
    }

    getProductActionButton(productName) {
        return this.getInventoryItem(productName).getByRole('button');
    }

    async openMenu() {
        await this.page.locator(ProductPageLocators.menuButton).click();
    }

    async logout() {
        await this.openMenu();
        await this.page.locator(ProductPageLocators.logoutButton).click();
    }

    async goToAboutPage() {
        await this.openMenu();
        await this.page.locator(ProductPageLocators.aboutPageButton).click();
    }

    async validateProducts() {
        const names = await this.page.locator(ProductPageLocators.productNames).allTextContents();
        const descriptions = await this.page.locator(ProductPageLocators.productDescriptions).allTextContents();
        const prices = await this.page.locator(ProductPageLocators.productPrices).allTextContents();
        const itemCount = await this.page.locator(ProductPageLocators.inventoryItems).count();

        if (itemCount === 0) {
            throw new Error('No products available on inventory page');
        }

        if (names.length !== itemCount || descriptions.length !== itemCount || prices.length !== itemCount) {
            throw new Error('Inventory details count mismatch');
        }

        return { itemCount, names, descriptions, prices };
    }

    async addProductToCart(productName) {
        await this.getProductActionButton(productName).click();
    }

    async removeProductFromCart(productName) {
        if (!productName) {
            throw new Error('productName is required to remove a product from the cart');
        }

        await this.getProductActionButton(productName).click();
    }

    async addAllProductsToCart() {
        const itemNames = await this.page.locator(ProductPageLocators.productNames).allTextContents();

        for (const itemName of itemNames) {
            await this.addProductToCart(itemName.trim());
        }
    }

    async addSpecificProductsToCart(productNames) {
        for (const productName of productNames) {
            await this.addProductToCart(productName);
        }
    }

    async openCart() {
        await this.page.locator(ProductPageLocators.shoppingCartLink).click();
    }

    async getCartBadgeCount() {
        const badge = this.page.locator(ProductPageLocators.shoppingCartBadge);

        if (!(await badge.isVisible().catch(() => false))) {
            return 0;
        }

        return Number(await badge.textContent());
    }

    async sortProducts(sortOption) {
        await this.page.locator(ProductPageLocators.sortDropdown).selectOption(sortOption);
    }

    async getDisplayedProductNames() {
        const names = await this.page.locator(ProductPageLocators.productNames).allTextContents();
        return names.map((name) => name.trim());
    }

    async getDisplayedProductPrices() {
        const prices = await this.page.locator(ProductPageLocators.productPrices).allTextContents();
        return prices.map((price) => Number(price.replace('$', '')));
    }

    async getInventoryItemCount() {
        return this.page.locator(ProductPageLocators.inventoryItems).count();
    }
}