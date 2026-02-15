import { Page } from "@playwright/test";
import { allure } from "allure-playwright";


export class SettingsPage {
  constructor(private page: Page) {}

  async navigateToFacilitators() {
    await allure.step("Navigate to Facilitators page", async () => {
      const currentUrl = this.page.url();
      if (currentUrl.includes("/settings/facilitators")) return;

      await this.page
        .locator(
          '[data-automation="navigate-to-profile-span-layout-enterprise"]',
        )
        .click();
      await this.page
        .locator(
          '[data-automation="navigate-to-facilitators-i-layout-enterprise"]',
        )
        .click();
      await this.page.waitForURL(/.*\/settings\/facilitators/, {
        timeout: 15000,
      });
    });
  }
}
