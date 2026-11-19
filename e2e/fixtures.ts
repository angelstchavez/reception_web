/* eslint-disable react-hooks/rules-of-hooks */
import { test as base } from "@playwright/test";
import { LoginPage } from "./pages/login.page";
import { DashboardPage } from "./pages/dashboard.page";
import { VisitorsPage } from "./pages/visitors.page";
import { UsersPage } from "./pages/users.page";

export const test = base.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  visitorsPage: VisitorsPage;
  usersPage: UsersPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  visitorsPage: async ({ page }, use) => {
    await use(new VisitorsPage(page));
  },
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
});

export { expect } from "@playwright/test";
