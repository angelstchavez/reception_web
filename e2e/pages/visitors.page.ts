import { Page, Locator } from "@playwright/test";

export interface VisitorData {
  fullName: string;
  email: string;
  password: string;
  expiresAt: string;
}

export class VisitorsPage {
  readonly page: Page;
  readonly createTab: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly expiresAtInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createTab = page
      .getByRole("tab", { name: /crear visitante/i })
      .or(page.getByRole("button", { name: /crear visitante/i }))
      .or(page.getByText("Crear visitante", { exact: true }))
      .first();
    this.fullNameInput = page.getByLabel(/nombre completo/i);
    this.emailInput = page.getByLabel(/correo electrónico/i);
    this.passwordInput = page.getByLabel(/contraseña temporal/i);
    this.expiresAtInput = page.getByLabel(/válido hasta/i);
    this.submitButton = page
      .locator("form")
      .getByRole("button", { name: /crear visitante/i });
    this.successMessage = page.getByRole("status");
    this.errorAlert = page.locator('p[role="alert"]');
  }

  async goto() {
    await this.page.goto("/visitors");
    await this.page.waitForLoadState("domcontentloaded");
    await this.openCreateTab();
  }

  async openCreateTab() {
    await this.createTab.click();
    await this.fullNameInput.waitFor({ state: "visible", timeout: 10_000 });
  }

  async createVisitor(v: VisitorData) {
    await this.fullNameInput.fill(v.fullName);
    await this.emailInput.fill(v.email);
    await this.passwordInput.fill(v.password);
    await this.expiresAtInput.fill(v.expiresAt);
    await this.submitButton.click();
  }
}
