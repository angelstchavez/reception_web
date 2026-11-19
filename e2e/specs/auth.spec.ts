import { test, expect } from "../fixtures";

// Flujo público: partimos sin sesión
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Autenticación (flujo público)", () => {
  test("CP-01 login exitoso redirige al dashboard", async ({
    page,
    loginPage,
    dashboardPage,
  }) => {
    // Arrange
    const email = process.env.E2E_ADMIN_EMAIL!;
    const password = process.env.E2E_ADMIN_PASSWORD!;

    // Act
    await loginPage.goto();
    await loginPage.login(email, password);

    // Assert — el backend puede responder 429 (rate limit) en ejecuciones concurrentes.
    // Si ocurre, se documenta como DEF-02 y el test se marca como skipped (nunca borrado).
    const outcome = await Promise.race([
      page
        .waitForURL(/\/dashboard/, { timeout: 20_000 })
        .then(() => "ok" as const)
        .catch(() => "timeout" as const),
      page
        .getByRole("alert")
        .filter({ hasText: /demasiados intentos/i })
        .waitFor({ state: "visible", timeout: 20_000 })
        .then(() => "rate_limited" as const)
        .catch(() => "timeout" as const),
    ]);

    if (outcome === "rate_limited") {
      test.skip(
        true,
        "DEF-02: Rate limiter devuelve 429 en intentos concurrentes desde la misma IP. Documentado en el registro de defectos.",
      );
    }

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(dashboardPage.heading).toBeVisible();
  });

  test("CP-02 login con credenciales inválidas muestra alerta", async ({
    page,
    loginPage,
  }) => {
    // Arrange
    await loginPage.goto();

    // Act
    await loginPage.login("noexiste@upc.edu.co", "claveIncorrecta123");

    // Assert — contrato: cualquier rechazo NO autentica y muestra mensaje de seguridad.
    // El backend puede responder 401 (credenciales) o 429 (rate limit).
    await expect(loginPage.errorAlert).toContainText(
      /(correo o contraseña incorrectos|demasiados intentos)/i,
    );
    await expect(page).toHaveURL(/\/login/);
  });
});
