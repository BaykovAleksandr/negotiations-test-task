import { expect, Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto(url: string) {
    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });
  }

  async login(email: string, password: string) {
    const emailInput = this.page.locator('input[name="email"]');
    const passwordInput = this.page.locator('input[type="password"]');
    const loginButton = this.page.locator(
      'button[data-automation="login-button-layout-login"]',
    );

    await expect(emailInput).toBeVisible({ timeout: 15000 });
    await emailInput.fill(email);

    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(password);

    await loginButton.click();
  }
}
