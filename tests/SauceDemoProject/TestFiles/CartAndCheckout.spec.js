import { test, expect } from '@playwright/test';
import { SauceDemoPage } from '../ClassFiles/SauceDemoPage';
import { ProductPage } from '../ClassFiles/ProductPage';
import { CartPage } from '../ClassFiles/CartPage';
import { CheckoutPage } from '../ClassFiles/CheckoutPage';
import { UserDetails } from '../TestData/DemoPageDetails';
import { LoginPageLocators } from '../Locators/LoginPageLocators';
import { ProductPageLocators } from '../Locators/ProductPageLocators';
import { CheckoutPageLocators } from '../Locators/CheckoutPageLocators';
import { productsToCart } from '../TestData/SpecificProducts';
import { CheckoutDetails } from '../TestData/CheckoutDetails';

test.describe('Cart and Checkout Tests', () => {
    let sauceDemoPage;
    let productPage;
    let cartPage;
    let checkoutPage;

    test.beforeEach(async ({ page }) => {
        sauceDemoPage = new SauceDemoPage(page);
        productPage = new ProductPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await sauceDemoPage.gotoUrl(UserDetails.BaseURL);
        await expect(page.locator(LoginPageLocators.passwordTextBox)).toHaveAttribute('type', 'password');
        await sauceDemoPage.Login(UserDetails.UserNames.standard_user, UserDetails.password);
        await expect(page).toHaveURL(UserDetails.InventoryURL);
        await expect(page.locator(ProductPageLocators.inventoryContainer)).toBeVisible();
    });

    test('should open cart and show selected products', async ({ page }) => {
        await productPage.addSpecificProductsToCart(productsToCart);
        await productPage.openCart();

        await expect(page).toHaveURL(UserDetails.CartURL);
        await expect(await cartPage.getCartItemNames()).toEqual(productsToCart);
    });

    test('should remove a product from cart', async ({ page }) => {
        await productPage.addSpecificProductsToCart(productsToCart);
        await productPage.openCart();
        await cartPage.removeProduct(productsToCart[0]);

        await expect(cartPage.getCartItem(productsToCart[0])).toHaveCount(0);
        await expect(page.locator(ProductPageLocators.shoppingCartBadge)).toHaveText(String(productsToCart.length - 1));
    });

    test('should continue shopping from cart page', async ({ page }) => {
        await productPage.addProductToCart(productsToCart[0]);
        await productPage.openCart();
        await cartPage.continueShopping();

        await expect(page).toHaveURL(UserDetails.InventoryURL);
    });

    test('should show validation error for missing checkout postal code', async ({ page }) => {
        await productPage.addProductToCart(productsToCart[0]);
        await productPage.openCart();
        await cartPage.goToCheckout();

        await expect(page).toHaveURL(UserDetails.CheckoutStepOneURL);
        await checkoutPage.fillCheckoutInformation(
            CheckoutDetails.missingPostalCodeCustomer.firstName,
            CheckoutDetails.missingPostalCodeCustomer.lastName,
            CheckoutDetails.missingPostalCodeCustomer.postalCode
        );
        await checkoutPage.continueCheckout();

        await expect(page.locator(CheckoutPageLocators.errorMessage)).toContainText('Postal Code is required');
    });

    test('should complete checkout successfully', async ({ page }) => {
        await productPage.addSpecificProductsToCart(productsToCart);
        await productPage.openCart();
        await cartPage.goToCheckout();

        await expect(page).toHaveURL(UserDetails.CheckoutStepOneURL);
        await checkoutPage.fillCheckoutInformation(
            CheckoutDetails.validCustomer.firstName,
            CheckoutDetails.validCustomer.lastName,
            CheckoutDetails.validCustomer.postalCode
        );
        await checkoutPage.continueCheckout();

        await expect(page).toHaveURL(UserDetails.CheckoutStepTwoURL);
        await expect(page.locator(CheckoutPageLocators.summaryContainer)).toBeVisible();

        await checkoutPage.finishCheckout();

        await expect(page).toHaveURL(UserDetails.CheckoutCompleteURL);
        await expect(page.locator(CheckoutPageLocators.completeHeader)).toHaveText('Thank you for your order!');
    });
});