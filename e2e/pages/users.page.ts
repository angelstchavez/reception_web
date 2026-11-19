import { Page, Locator } from "@playwright/test";

export class UsersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /^usuarios$/i });
    this.table = page.getByRole("table");
    this.rows = page.getByRole("row");
    this.searchInput = page.getByPlaceholder(/buscar nombre o correo/i);
  }

  async goto() {
    await this.page.goto("/users");
    await this.page.waitForLoadState("domcontentloaded");
    await this.table.waitFor({ state: "visible", timeout: 10_000 });
    await this.page
      .waitForFunction(
        () => document.querySelectorAll("table tbody tr").length >= 1,
        { timeout: 10_000 },
      )
      .catch(() => {});
  }

  async search(term: string) {
    await this.searchInput.fill(term);
    await this.page.waitForFunction(() => true);
  }
}
