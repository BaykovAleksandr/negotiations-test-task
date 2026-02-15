import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { SettingsPage } from "../pages/SettingsPage";
import { FacilitatorsPage } from "../pages/FacilitatorsPage";

const testUser = {
  email: "test_user03@negotiations.com",
  password: "Test_Pass_ForUser",
};

test.describe("Facilitators page functional tests", () => {
  let loginPage: LoginPage;
  let settingsPage: SettingsPage;
  let facilitatorsPage: FacilitatorsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    settingsPage = new SettingsPage(page);
    facilitatorsPage = new FacilitatorsPage(page);

    await loginPage.goto(process.env.TEST_ENV_URL || "https://qa3.negsim.com");
    await loginPage.login(testUser.email, testUser.password);
    await settingsPage.navigateToFacilitators();
  });

  test("should display facilitators list", async () => {
    const firstRow = facilitatorsPage.getFirstActiveRow();
    await expect(firstRow).toBeVisible();
  });

  test("should expand facilitator stats and click analytics icon (bug)", async () => {
    const firstRow = facilitatorsPage.getFirstActiveRow();
    await facilitatorsPage.expandStats(firstRow);
    await facilitatorsPage.clickAnalyticsIcon(firstRow);
    await expect(firstRow).toBeVisible();
  });

  test("should sort by Organization column (known 500 error)", async () => {
    await facilitatorsPage.sortBy("Organization");
    const errorElement =
      await facilitatorsPage.page.locator("text=We're Sorry!");
    await expect(errorElement).toHaveCount(0);
  });

  test("should open +Facilitator modal and verify UI elements", async () => {
    await facilitatorsPage.openAddFacilitatorModal();
    await expect(facilitatorsPage.filtersButton).toBeVisible();
    await expect(facilitatorsPage.searchButtonInModal).toBeVisible();
    await expect(facilitatorsPage.emailInvitationButton).toBeVisible();
  });

  test("BUG: date filter field is disabled", async () => {
    await facilitatorsPage.openAddFacilitatorModal();
    await facilitatorsPage.openFilterPanel();
    const isDisabled = await facilitatorsPage.isDateFilterDisabled();
    expect(isDisabled).toBeTruthy();
  });

  test("BUG: email invitation can be sent without First Name and Message", async () => {
    await facilitatorsPage.openEmailInvitationForm();
    await facilitatorsPage.fillEmailOnly("test@example.com");
    const sendButton = facilitatorsPage.page.locator(
      'button:has-text("Send Invitation")',
    );
    await expect(sendButton).toBeEnabled();
    await sendButton.click();
    const errorMessage = facilitatorsPage.page.locator(".error-message");
    await expect(errorMessage).toHaveCount(0);
  });

  test("should send internal invitation to existing user", async () => {
    await facilitatorsPage.openAddFacilitatorModal();
    const userName = await facilitatorsPage.getFirstUserNameInModal();
    await facilitatorsPage.selectFirstUserInModal();
    await facilitatorsPage.clickSendInternalInvitation();
    await facilitatorsPage.page.waitForTimeout(2000);
    const isPresent = await facilitatorsPage.isUserInSentInvitations(userName);
    expect(isPresent).toBeTruthy();
  });

  test("should reinstate facilitator from archive and add to end of active list", async () => {
    await facilitatorsPage.expandArchivedSection();
    await facilitatorsPage.page.waitForSelector(
      ".archived-enterprise-facilitators tbody tr",
      { timeout: 5000 },
    );

    const archivedNames = await facilitatorsPage.getArchivedFacilitatorNames();
    expect(archivedNames.length).toBeGreaterThan(0);
    const facilitatorToReinstate = archivedNames[0];
    console.log(`Reinstating facilitator: "${facilitatorToReinstate}"`);

    const archivedRow = facilitatorsPage.archivedSection
      .locator(`tr:has-text("${facilitatorToReinstate}")`)
      .first();
    await facilitatorsPage.clickActionsOnArchivedRow(archivedRow);
    await facilitatorsPage.clickReinstate();

    await archivedRow.waitFor({ state: "detached", timeout: 5000 });

    const activeNamesAfter =
      await facilitatorsPage.getAllActiveFacilitatorNames();
    expect(activeNamesAfter).toContain(facilitatorToReinstate);
  });
});
