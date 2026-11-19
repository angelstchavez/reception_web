import { test, expect } from "../fixtures";
import { EventsPage } from "../pages/events.page";

test.use({ storageState: "e2e/.auth/admin.json" });

test.describe("IA-02 Filtro de eventos de acceso", () => {
  test("el filtro 'Entradas' muestra solo filas con badge 'Entrada'", async ({
    page,
  }) => {
    // ───────────── ARRANGE ─────────────
    // 1. Interceptamos la petición a la API y devolvemos datos falsos (Mocking)
    await page.route("**/api/reception/access-events**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "1",
            user_id: "u1",
            event_type: "entry",
            recorded_by_user_id: "admin",
            recorded_at: new Date().toISOString(),
          },
          {
            id: "2",
            user_id: "u2",
            event_type: "exit",
            recorded_by_user_id: "admin",
            recorded_at: new Date().toISOString(),
          },
          {
            id: "3",
            user_id: "u3",
            event_type: "entry",
            recorded_by_user_id: "admin",
            recorded_at: new Date().toISOString(),
          },
        ]),
      });
    });

    const events = new EventsPage(page);

    await events.goto();
    await expect(page).toHaveURL(/\/dashboard\/events/);
    await expect(events.table).toBeVisible();

    // ───────────── ACT ─────────────
    await events.filterEntries.click();

    // ───────────── ASSERT ─────────────
    // 1) No queda ninguna fila "Salida"
    await expect(events.rowsWithBadge("Salida")).toHaveCount(0);

    // 2) Hay al menos una fila
    await expect(events.rows).toHaveCount(2); // Sabemos que metimos 2 "entry" y 1 "exit"

    // 3) TODAS las filas visibles son "Entrada"
    await expect(events.rowsWithBadge("Entrada")).toHaveCount(2);
  });
});
