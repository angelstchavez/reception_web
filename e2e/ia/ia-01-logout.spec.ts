import { test, expect } from "../fixtures";
import { DashboardPage } from "../pages/dashboard.page";
import { UserMenuPage } from "../pages/user-menu.page";

test.use({ storageState: "e2e/.auth/admin.json" });

test.describe("IA-01 Logout", () => {
  test("el admin cierra sesión y pierde acceso a /dashboard", async ({
    page,
  }) => {
    // ───────────── ARRANGE ─────────────
    const dashboard = new DashboardPage(page);
    const userMenu = new UserMenuPage(page);

    await dashboard.goto();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(dashboard.heading).toBeVisible();

    // ───────────── ACT ─────────────
    await userMenu.logout();

    // ───────────── ASSERT ─────────────
    // 1. El frontend redirige al login
    await expect(page).toHaveURL(/\/login/, { timeout: 10_000 });

    // 2. Las cookies deben desaparecer (DEF-04 corregido)
    await expect
      .poll(
        async () => {
          const cookies = await page.context().cookies();
          return cookies.some((c) => c.name === "rap_access_token");
        },
        {
          message:
            "La cookie rap_access_token debe ser eliminada tras el logout",
          timeout: 5000,
        },
      )
      .toBe(false);

    // 3. Intentar volver a entrar a una ruta privada debe rebotar al login
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
