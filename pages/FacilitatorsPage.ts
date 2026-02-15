import { Page, Locator, expect } from "@playwright/test";
import { allure } from "allure-playwright";

export class FacilitatorsPage {
  public addFacilitatorButton: Locator;
  public searchButton: Locator;
  public filterPanel: Locator;
  public activeSection: Locator;
  public archivedSection: Locator;
  public sentInvitationsSection: Locator;
  public emailInvitationButton: Locator;
  public dateFilterField: Locator;
  public emailInputInInviteForm: Locator;
  public sendInvitationButton: Locator;
  public addFacilitatorModal: Locator;
  public filtersButton: Locator;
  public searchButtonInModal: Locator;

  constructor(public page: Page) {
    this.addFacilitatorButton = this.page.locator(
      '[data-automation="add-facilitators-button-layout-enterprise"]',
    );
    this.searchButton = this.page.locator(
      '[data-automation="search-button-shared"]',
    );
    this.filterPanel = this.page.locator("sim-filter-panel");
    this.activeSection = this.page.locator(
      'sim-enterprise-facilitators-section:has-text("Active")',
    );
    this.archivedSection = this.page.locator(
      'sim-enterprise-facilitators-section:has-text("Archived")',
    );
    this.sentInvitationsSection = this.page.locator(
      'sim-enterprise-facilitators-section:has-text("Sent Invitations")',
    );
    this.emailInvitationButton = this.page.locator(
      '[data-automation="email-invitation-button-layout-enterprise"]',
    );
    this.emailInputInInviteForm = this.page.locator(
      '[data-automation="email-sim-input-layout-enterprise"] input',
    );
    this.sendInvitationButton = this.page.locator(
      'button:has-text("Send Invitation")',
    );

    this.addFacilitatorModal = this.page.locator(".add-facilitators-modal");
    this.filtersButton = this.addFacilitatorModal.locator(
      '[data-automation="filters-button-shared"]',
    );
    this.searchButtonInModal = this.addFacilitatorModal.locator(
      '[data-automation="search-button-shared"]',
    );
    this.dateFilterField =
      this.addFacilitatorModal.locator(".label-date-range");
  }

  getFacilitatorRowByName(name: string): Locator {
    return this.activeSection.locator(`tr:has-text("${name}")`);
  }

  getFirstActiveRow(): Locator {
    return this.activeSection.locator("tbody tr").first();
  }

  async expandStats(row: Locator) {
    await allure.step("Expand facilitator statistics", async () => {
      await row.locator(".expand").click();
      await this.page.waitForSelector("sim-enterprise-classes-expand-grid");
    });
  }

  async sortBy(columnName: string) {
    await allure.step(`Sort by column: ${columnName}`, async () => {
      await this.activeSection
        .locator(`th:has-text("${columnName}")`)
        .first()
        .click();
      await this.page.waitForLoadState("networkidle");
    });
  }

  async openAddFacilitatorModal() {
    await allure.step("Open Add Facilitator modal", async () => {
      await this.addFacilitatorButton.click();
      await this.addFacilitatorModal.waitFor({
        state: "visible",
        timeout: 5000,
      });
    });
  }

  async openFilterPanel() {
    await allure.step("Open filter panel", async () => {
      await this.filtersButton.click();
    });
  }

  async isDateFilterDisabled(): Promise<boolean> {
    let result = false;
    await allure.step("Check if date filter is disabled", async () => {
      const classNames = await this.dateFilterField.getAttribute("class");
      result = classNames?.includes("disabled") ?? false;
    });
    return result;
  }

  async expandArchivedSection() {
    await allure.step("Expand archived section", async () => {
      const archivedHeader = this.archivedSection.locator("h3");
      const isCollapsed =
        (await archivedHeader.locator('svg-icon[src*="angle-up"]').count()) ===
        0;
      if (isCollapsed) {
        await archivedHeader.click();
      }
    });
  }

  async clickActionsOnArchivedRow(row: Locator) {
    await allure.step("Click actions on archived facilitator", async () => {
      await row.locator(".actions").click();
    });
  }

  async clickReinstate() {
    await allure.step("Click Reinstate", async () => {
      await this.page.locator("text=Reinstate").click();
    });
  }

  async openEmailInvitationForm() {
    await allure.step("Open email invitation form", async () => {
      await this.openAddFacilitatorModal();
      await this.emailInvitationButton.click();
      await this.page
        .locator('[data-automation="close-invitation-i-layout-enterprise"]')
        .waitFor({ state: "visible", timeout: 5000 });
    });
  }

  async fillEmailOnly(email: string) {
    await allure.step("Fill only email field", async () => {
      await this.emailInputInInviteForm.fill(email);
    });
  }

  async clickAnalyticsIcon(row: Locator) {
    await allure.step("Click analytics icon", async () => {
      const expandedContainer = this.page
        .locator("sim-enterprise-classes-expand-grid")
        .first();
      await expandedContainer.locator(".link").first().click();
    });
  }

  async selectFirstUserInModal() {
    await allure.step("Select first user in modal", async () => {
      const row = this.addFacilitatorModal.locator("tbody tr").first();
      await row.hover();
      const checkboxWrapper = row.locator(
        "td.row-selector label.checkboxWrapper",
      );
      await checkboxWrapper.click();
      const checkbox = row.locator('input[type="checkbox"]');
      await expect(checkbox).toBeChecked({ timeout: 5000 });
    });
  }

  async clickSendInternalInvitation() {
    await allure.step("Send internal invitation", async () => {
      const sendButton = this.addFacilitatorModal.locator(
        'button.update:has-text("Send Invitation")',
      );
      await sendButton.waitFor({ state: "visible", timeout: 5000 });
      await sendButton.click();
      await this.addFacilitatorModal.waitFor({
        state: "hidden",
        timeout: 5000,
      });
    });
  }

  async getFirstUserNameInModal(): Promise<string> {
    let name = "";
    await allure.step("Get first user name in modal", async () => {
      const nameElement = this.addFacilitatorModal
        .locator("tbody tr")
        .first()
        .locator(".name-content")
        .first();
      name = (await nameElement.textContent()) || "";
    });
    return name;
  }

  async isUserInSentInvitations(name: string): Promise<boolean> {
    let present = false;
    await allure.step("Check user in sent invitations", async () => {
      const row = this.sentInvitationsSection.locator(`tr:has-text("${name}")`);
      present = (await row.count()) > 0;
    });
    return present;
  }

  async getArchivedFacilitatorNames(): Promise<string[]> {
    const names: string[] = [];
    await allure.step("Get archived facilitator names", async () => {
      await this.archivedSection
        .locator("tbody tr")
        .first()
        .waitFor({ state: "attached", timeout: 5000 })
        .catch(() => {});
      const rows = this.archivedSection.locator("tbody tr");
      const count = await rows.count();
      for (let i = 0; i < count; i++) {
        const name = await rows
          .nth(i)
          .locator(".name-content")
          .first()
          .textContent();
        if (name) names.push(name.trim());
      }
    });
    return names;
  }

  async getActiveFacilitatorNames(): Promise<string[]> {
    const names: string[] = [];
    await allure.step("Get active facilitator names", async () => {
      const rows = this.activeSection.locator("tbody tr");
      const count = await rows.count();
      for (let i = 0; i < count; i++) {
        const name = await rows
          .nth(i)
          .locator(".name-content")
          .first()
          .textContent();
        if (name) names.push(name.trim());
      }
    });
    return names;
  }

  async getAllActiveFacilitatorNames(): Promise<string[]> {
    const allNames: string[] = [];
    await allure.step("Get all active facilitators across pages", async () => {
      let hasNext = true;
      while (hasNext) {
        const pageNames = await this.getActiveFacilitatorNames();
        allNames.push(...pageNames);
        const nextButton = this.activeSection.locator(
          ".pagination .pages.next:not(.disabled)",
        );
        if ((await nextButton.count()) > 0) {
          await nextButton.click();
          await this.page.waitForLoadState("networkidle");
          await this.page.waitForTimeout(500);
        } else {
          hasNext = false;
        }
      }
    });
    return allNames;
  }
}
