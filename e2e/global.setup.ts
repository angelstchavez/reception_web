import { test as setup, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const ADMIN_STATE = "e2e/.auth/admin.json";
const GUARD_STATE = "e2e/.auth/guard.json";

function ensureEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Defínela en .env.e2e (ver README) antes de correr Playwright.`,
    );
  }
  return value;
}

async function loginAndSave(
  page: Page,
  email: string,
  password: string,
  storagePath: string,
) {
  fs.mkdirSync(path.dirname(storagePath), { recursive: true });

  await page.goto("/login");
  await page.getByLabel(/correo electrónico/i).fill(email);
  await page.getByLabel(/^contraseña$/i).fill(password);
  await page.getByRole("button", { name: /^iniciar sesión$/i }).click();
  await page.waitForURL("**/dashboard", { timeout: 15_000 });

  await page.context().storageState({ path: storagePath });
}

setup("autenticar como admin", async ({ page }) => {
  await loginAndSave(
    page,
    ensureEnv("E2E_ADMIN_EMAIL"),
    ensureEnv("E2E_ADMIN_PASSWORD"),
    ADMIN_STATE,
  );
});

setup("autenticar como guardia", async ({ page }) => {
  await loginAndSave(
    page,
    ensureEnv("E2E_GUARD_EMAIL"),
    ensureEnv("E2E_GUARD_PASSWORD"),
    GUARD_STATE,
  );
});
