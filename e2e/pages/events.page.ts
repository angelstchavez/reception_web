import type { Locator, Page } from "@playwright/test";

export class EventsPage {
  readonly page: Page;
  readonly table: Locator;
  readonly rows: Locator;
  readonly filterAll: Locator;
  readonly filterEntries: Locator;
  readonly filterExits: Locator;

  constructor(page: Page) {
    this.page = page;
    this.table = page.getByRole("table");
    // Solo filas de datos: excluye la fila del encabezado (columnheader)
    this.rows = this.table
      .getByRole("row")
      .filter({ hasNot: page.getByRole("columnheader") });
    // exact: true evita confundir "Entradas" (botón) con "Entrada" (badge)
    this.filterAll = page.getByRole("button", { name: "Todos", exact: true });
    this.filterEntries = page.getByRole("button", {
      name: "Entradas",
      exact: true,
    });
    this.filterExits = page.getByRole("button", {
      name: "Salidas",
      exact: true,
    });
  }

  async goto() {
    await this.page.goto("/dashboard/events");
  }

  /** Filas de datos cuyo badge coincide exactamente con "Entrada" o "Salida". */
  rowsWithBadge(label: "Entrada" | "Salida"): Locator {
    return this.rows.filter({
      has: this.page.getByText(label, { exact: true }),
    });
  }
}
