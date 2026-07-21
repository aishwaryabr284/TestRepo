import { LoginPageLocators } from "../Locators/LoginPageLocators";


exports.SauceDemoPage = class SauceDemoPage{

    constructor(page){
        this.page = page;
    }
    
    async gotoUrl(PageUrl){
        await this.page.goto(PageUrl);
    }

    async Login(username,password){
        await this.page.locator(LoginPageLocators.usernameTextBox).fill(username);
        await this.page.locator(LoginPageLocators.passwordTextBox).fill(password);
        await this.page.locator(LoginPageLocators.loginButton).click();
    }
    
    async isLoginButtonVisible(){
        return this.page.locator(LoginPageLocators.loginButton).isVisible();
    }
        
}