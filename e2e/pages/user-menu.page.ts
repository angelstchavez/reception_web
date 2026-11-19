import { expect, type Locator, type Page } from "@playwright/test";

export class UserMenuPage {
  readonly page: Page;
  readonly trigger: Locator;
  readonly logoutItem: Locator;

  constructor(page: Page) {
    this.page = page;
    // El trigger es un <button> (SidebarMenuButton) que contiene
    // el nombre completo y ROLE_LABEL[admin] = "Administrador".
    this.trigger = page.getByRole("button", { name: /Administrador/ });
    // DropdownMenuItem => role "menuitem"
    this.logoutItem = page.getByRole("menuitem", { name: "Cerrar sesión" });
  }

  async open() {
    await this.trigger.click();
    await expect(this.logoutItem).toBeVisible();
  }

  async logout() {
    await this.open();
    await this.logoutItem.click();
  }
}