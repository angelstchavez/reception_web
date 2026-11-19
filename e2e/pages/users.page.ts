import { Page, Locator } from "@playwright/test";

export class UsersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly roleTab: (label: string) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /^usuarios$/i });
    this.table = page.getByRole("table");
    this.rows = page.getByRole("row");
    this.roleTab = (label: string) =>
      page
        .getByRole("tab", { name: new RegExp(label, "i") })
        .or(page.getByRole("button", { name: new RegExp(label, "i") }))
        .or(page.getByText(label, { exact: true }).first());
  }

  async goto() {
    await this.page.goto("/users");
  }

  async filterByRole(label: string) {
    await this.roleTab(label).click();
  }
}
