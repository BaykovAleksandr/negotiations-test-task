import { expect, Page } from "@playwright/test";
import { allure } from "allure-playwright";

export class LoginPage {
  constructor(private page: Page) {}

  async goto(url: string) {
    await allure.step("Open login page", async () => {
      await this.page.goto(url, {
        waitUntil: "networkidle",
        timeout: 60000,
      });
    });
  }

  async login(email: string, password: string) {
    await allure.step("Fill email", async () => {
      const emailInput = this.page.locator('input[name="email"]');
      await expect(emailInput).toBeVisible({ timeout: 15000 });
      await emailInput.fill(email);
    });

    await allure.step("Fill password", async () => {
      const passwordInput = this.page.locator('input[type="password"]');
      await expect(passwordInput).toBeVisible();
      await passwordInput.fill(password);
    });

    await allure.step("Click login button", async () => {
      const loginButton = this.page.locator('button[data-automation="login-button-layout-login"]');
      await loginButton.click();
    });
  }
}
