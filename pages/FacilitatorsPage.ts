import { Page, Locator, expect } from "@playwright/test";

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

  getFirstArchivedRow(): Locator {
    return this.archivedSection.locator("tbody tr").first();
  }

  async expandStats(row: Locator) {
    await row.locator(".expand").click();
    await this.page.waitForSelector("sim-enterprise-classes-expand-grid");
  }

  async sortBy(columnName: string) {
    await this.activeSection
      .locator(`th:has-text("${columnName}")`)
      .first()
      .click();
    await this.page.waitForLoadState("networkidle");
  }

  async openAddFacilitatorModal() {
    await this.addFacilitatorButton.click();
    await this.addFacilitatorModal.waitFor({ state: "visible", timeout: 5000 });
  }

  async openFilterPanel() {
    await this.filtersButton.click();
  }

  async isDateFilterDisabled(): Promise<boolean> {
    const classNames = await this.dateFilterField.getAttribute("class");
    return classNames?.includes("disabled") ?? false;
  }

  async expandArchivedSection() {
    const archivedHeader = this.archivedSection.locator("h3");
    const isCollapsed =
      (await archivedHeader.locator('svg-icon[src*="angle-up"]').count()) === 0;
    if (isCollapsed) {
      await archivedHeader.click();
    }
  }

  async clickActionsOnArchivedRow(row: Locator) {
    await row.locator(".actions").click();
  }

  async clickReinstate() {
    await this.page.locator("text=Reinstate").click();
  }

  async isFacilitatorActive(name: string): Promise<boolean> {
    const row = this.getFacilitatorRowByName(name);
    return (await row.count()) > 0;
  }

  async openEmailInvitationForm() {
    await this.openAddFacilitatorModal();
    await this.emailInvitationButton.click();
    await this.page
      .locator('[data-automation="close-invitation-i-layout-enterprise"]')
      .waitFor({ state: "visible", timeout: 5000 });
  }

  async fillEmailOnly(email: string) {
    await this.emailInputInInviteForm.fill(email);
  }

  async clickSendInvitation() {
    await this.sendInvitationButton.click();
  }

  async clickAnalyticsIcon(row: Locator) {
    const expandedContainer = this.page
      .locator("sim-enterprise-classes-expand-grid")
      .first();
    await expandedContainer.locator(".link").first().click();
  }

  async selectFirstUserInModal() {
    const row = this.addFacilitatorModal.locator("tbody tr").first();
    await row.hover();
    const checkboxWrapper = row.locator(
      "td.row-selector label.checkboxWrapper",
    );
    await checkboxWrapper.click();
    const checkbox = row.locator('input[type="checkbox"]');
    await expect(checkbox).toBeChecked({ timeout: 5000 });
  }

  async clickSendInternalInvitation() {
    const sendButton = this.addFacilitatorModal.locator(
      'button.update:has-text("Send Invitation")',
    );
    await sendButton.waitFor({ state: "visible", timeout: 5000 });
    await sendButton.click();
    await this.addFacilitatorModal.waitFor({ state: "hidden", timeout: 5000 });
  }

  async getFirstUserNameInModal(): Promise<string> {
    const nameElement = this.addFacilitatorModal
      .locator("tbody tr")
      .first()
      .locator(".name-content")
      .first();
    return (await nameElement.textContent()) || "";
  }

  async isUserInSentInvitations(name: string): Promise<boolean> {
    const row = this.sentInvitationsSection.locator(`tr:has-text("${name}")`);
    return (await row.count()) > 0;
  }

  async getArchivedFacilitatorNames(): Promise<string[]> {
    await this.archivedSection
      .locator("tbody tr")
      .first()
      .waitFor({ state: "attached", timeout: 5000 })
      .catch(() => {});
    const rows = this.archivedSection.locator("tbody tr");
    const count = await rows.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await rows
        .nth(i)
        .locator(".name-content")
        .first()
        .textContent();
      if (name) names.push(name.trim());
    }
    return names;
  }

  async getLastActiveRowName(): Promise<string> {
    const rows = this.activeSection.locator("tbody tr");
    const count = await rows.count();
    if (count === 0) return "";
    const lastRow = rows.nth(count - 1);
    const name = await lastRow.locator(".name-content").first().textContent();
    return name?.trim() || "";
  }

  async getActiveFacilitatorNames(): Promise<string[]> {
    const rows = this.activeSection.locator("tbody tr");
    const count = await rows.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      const name = await rows
        .nth(i)
        .locator(".name-content")
        .first()
        .textContent();
      if (name) names.push(name.trim());
    }
    return names;
  }

  async getAllActiveFacilitatorNames(): Promise<string[]> {
    const allNames: string[] = [];
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
    return allNames;
  }
}
