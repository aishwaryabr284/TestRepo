import { test, expect } from '@playwright/test'
import { SauceDemoPage } from '../ClassFiles/SauceDemoPage';
import { ProductPage } from '../ClassFiles/ProductPage';
import { UserDetails } from '../TestData/DemoPageDetails';
import { LoginPageLocators } from '../Locators/LoginPageLocators';
import { ProductPageLocators } from '../Locators/ProductPageLocators';
import { productsToCart } from '../TestData/SpecificProducts';


test.describe('ProductPageTests', () => {

    let sauceDemoPage;
    let productPage;

    test.beforeEach('LoginTest', async ({ page }) => {
        sauceDemoPage = new SauceDemoPage(page);
        productPage = new ProductPage(page);
        await sauceDemoPage.gotoUrl(UserDetails.BaseURL);
        await expect(page.locator(LoginPageLocators.passwordTextBox)).toHaveAttribute('type', 'password');
        await sauceDemoPage.Login(UserDetails.UserNames.standard_user, UserDetails.password);
        await expect(page).toHaveURL(UserDetails.InventoryURL);
        await expect(page).toHaveTitle(LoginPageLocators.loginPageTitle);
        await expect(page.locator(ProductPageLocators.inventoryContainer)).toBeVisible();
    });

    test('LogoutTest', async ({ page }) => {
        await expect(page.locator(ProductPageLocators.menuButton)).toHaveAttribute('type', 'button');
        await productPage.logout();
        await expect(page).toHaveURL(UserDetails.BaseURL);
        await expect(page.locator(LoginPageLocators.loginButton)).toBeVisible();
    });

    test('AboutPageTest', async ({ page }) => {
        await expect(page.locator(ProductPageLocators.menuButton)).toHaveAttribute('type', 'button');
        await productPage.goToAboutPage();
        await expect(page).toHaveURL(/saucelabs\.com/);
        await page.goBack();
        await expect(page).toHaveURL(UserDetails.InventoryURL);
    });

    test('ValidateProductsTest', async () => {
        const inventory = await productPage.validateProducts();
        expect(inventory.itemCount).toBeGreaterThan(0);
    });

    test('SortProductsByNameDescending', async () => {
        await productPage.sortProducts('za');

        const actualNames = await productPage.getDisplayedProductNames();
        const expectedNames = [...actualNames].sort((first, second) => second.localeCompare(first));

        expect(actualNames).toEqual(expectedNames);
    });

    test('SortProductsByPriceLowToHigh', async () => {
        await productPage.sortProducts('lohi');

        const actualPrices = await productPage.getDisplayedProductPrices();
        const expectedPrices = [...actualPrices].sort((first, second) => first - second);

        expect(actualPrices).toEqual(expectedPrices);
    });

    for (const productName of productsToCart) {
        test(`AddSingleProductToCart - ${productName}`, async ({ page }) => {
            await productPage.addProductToCart(productName);

            await expect(productPage.getProductActionButton(productName)).toHaveText('Remove');
            await expect(page.locator(ProductPageLocators.shoppingCartBadge)).toHaveText('1');
        });
    }

    for (const productName of productsToCart) {
        test(`RemoveProductFromCart - ${productName}`, async ({ page }) => {
            await productPage.addProductToCart(productName);

            await expect(productPage.getProductActionButton(productName)).toHaveText('Remove');
            await productPage.removeProductFromCart(productName);
            await expect(page.locator(ProductPageLocators.shoppingCartBadge)).toHaveCount(0);
        });
    }

    

    test('AddSpecificProductsToCart', async ({ page }) => {
        await productPage.addSpecificProductsToCart(productsToCart);

        await expect(page.locator(ProductPageLocators.shoppingCartBadge)).toHaveText(String(productsToCart.length));
    });

    test('AddAllProductsToCart', async ({ page }) => {
        const inventoryItemCount = await productPage.getInventoryItemCount();

        await productPage.addAllProductsToCart();

        await expect(page.locator(ProductPageLocators.shoppingCartBadge)).toHaveText(String(inventoryItemCount));
    });
});
