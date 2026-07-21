import { test, expect } from '@playwright/test'
import { SauceDemoPage } from '../ClassFiles/SauceDemoPage';
import { UserDetails } from '../TestData/DemoPageDetails';
import { LoginPageLocators } from '../Locators/LoginPageLocators';
import { loginFailureScenarios, validLoginScenarios } from '../TestData/LoginScenarios';

test.describe('SauceDemo Login Tests', () => {

    for (const scenario of validLoginScenarios) {
        test(`should login successfully with ${scenario.userName}`, async ({ page }) => {
            const sauceDemoPage = new SauceDemoPage(page);

            await sauceDemoPage.gotoUrl(UserDetails.BaseURL);
            await expect(page.locator(LoginPageLocators.passwordTextBox)).toHaveAttribute('type', 'password');
            await expect(sauceDemoPage.isLoginButtonVisible()).toBeTruthy();
            await sauceDemoPage.Login(scenario.userName, UserDetails.password);

            await expect(page).toHaveURL(UserDetails.InventoryURL);
            await expect(page).toHaveTitle(LoginPageLocators.loginPageTitle);
        });
    }

    for (const scenario of loginFailureScenarios) {
        test(`should show error for ${scenario.name}`, async ({ page }) => {
            const sauceDemoPage = new SauceDemoPage(page);

            await sauceDemoPage.gotoUrl(UserDetails.BaseURL);
            await sauceDemoPage.Login(scenario.userName, scenario.password);

            await expect(page.locator(LoginPageLocators.errorMessage)).toContainText(scenario.expectedMessage);
            await expect(page).toHaveURL(UserDetails.BaseURL);
        });
    }

    test('should login successfully with performance glitch user after delay', async ({ page }) => {
        test.slow();

        const sauceDemoPage = new SauceDemoPage(page);
        const loginStartedAt = Date.now();

        await sauceDemoPage.gotoUrl(UserDetails.BaseURL);
        await expect(page.locator(LoginPageLocators.passwordTextBox)).toHaveAttribute('type', 'password');
        await sauceDemoPage.Login(UserDetails.UserNames.performance_glitch_user, UserDetails.password);
        await expect(page).toHaveURL(UserDetails.InventoryURL, { timeout: 15000 });

        const loginDuration = Date.now() - loginStartedAt;

        expect(loginDuration).toBeGreaterThan(1000);
        await expect(page).toHaveTitle(LoginPageLocators.loginPageTitle);
    });
});
