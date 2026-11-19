import { Page, Locator } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly sidebar: Locator;
  readonly sidebarLink: (name: RegExp) => Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole("heading", { name: /buenos días/i });
    this.sidebar = page.locator("[data-slot='sidebar']");
    this.sidebarLink = (name: RegExp) =>
      page.getByRole("link", { name });
  }

  async goto() {
    await this.page.goto("/dashboard");
  }
}