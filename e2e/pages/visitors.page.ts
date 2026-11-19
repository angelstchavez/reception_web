import { Page, Locator } from "@playwright/test";

export interface VisitorData {
  fullName: string;
  email: string;
  password: string;
  expiresAt: string;
}

export class VisitorsPage {
  readonly page: Page;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly expiresAtInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fullNameInput = page.getByLabel(/nombre completo/i);
    this.emailInput = page.getByLabel(/correo electrónico/i);
    this.passwordInput = page.getByLabel(/contraseña temporal/i);
    this.expiresAtInput = page.getByLabel(/válido hasta/i);
    this.submitButton = page.getByRole("button", { name: /crear visitante/i });
    this.successMessage = page.getByRole("status");
    this.errorAlert = page.getByRole("alert");
  }

  async goto() {
    await this.page.goto("/visitors");
    const formVisible = await this.fullNameInput.isVisible().catch(() => false);
    if (!formVisible) {
      const openBtn = this.page
        .getByRole("button", {
          name: /nuevo visitante|crear visitante|agregar visitante|añadir visitante|\+/i,
        })
        .first();
      await openBtn.click({ timeout: 5_000 }).catch(() => {});
    }
  }

  async createVisitor(v: VisitorData) {
    await this.fullNameInput.fill(v.fullName);
    await this.emailInput.fill(v.email);
    await this.passwordInput.fill(v.password);
    await this.expiresAtInput.fill(v.expiresAt);
    await this.submitButton.click();
  }
}
