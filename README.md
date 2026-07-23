# SauceDemo Playwright Project

## Overview

A Playwright Javascript automation framework for testing SauceDemo e-commerce workflows using Page Object Model, reusable locators,externalized test data, cross-browser execution and HTML reporting.

## Tech stack

-Javascript
-Playwright test
-Page Object Model
-Github Actions

## Scenarios Covered

- Login with valid users
- Login error handling for invalid credentials and locked users
- Inventory validation
- Product sorting by name and price
- Add one, selected, and all products to cart
- Open cart, remove product, and continue shopping
- Checkout validation and successful order completion
- Menu actions like About and Logout

## Project Structure

```text
test/SauceDempProject/
|-- ClassFiles/
|-- Locators/
|-- TestData/
|-- TestFiles/
```

## Installation

```powershell
nmp install
nmx playwright install
```

## Run

```powershell
npm test
npm run test:headed
npm run test:saucedemo
```

## View Report

```powershell
npx playwright show-report
```

## Github Actions CI

The repository includes '.github/workflows/playwright.yml' to run playwright tests automatically on push and pull requests to 'main' branch.The workflow installs dependencies, installs Playwright browsers, executes tests and uploads the HTML report as an artifact.