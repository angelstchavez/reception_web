import { test, expect } from "../fixtures";
import type { VisitorData } from "../pages/visitors.page";

// Flujo de guardia: storageState del guardia
test.use({ storageState: "e2e/.auth/guard.json" });

test.describe("Gestión de visitantes (guardia)", () => {
  test("CP-03 guardia crea visitante válido", async ({ visitorsPage }) => {
    // Arrange
    const visitor: VisitorData = {
      fullName: "Visitante Prueba Uno",
      email: `e2e-visit-${Date.now()}@upc.edu.co`,
      password: "Temporal123!",
      expiresAt: "2030-12-31T23:59",
    };

    // Act
    await visitorsPage.goto();
    await visitorsPage.createVisitor(visitor);

    // Assert
    await expect(visitorsPage.successMessage).toContainText(visitor.fullName);
  });

  test("CP-04 fecha de vencimiento pasada es rechazada", async ({
    visitorsPage,
  }) => {
    // Arrange
    const expired: VisitorData = {
      fullName: "Visitante Vencido",
      email: `e2e-expired-${Date.now()}@upc.edu.co`,
      password: "Temporal123!",
      expiresAt: "2020-01-01T10:00",
    };

    // Act
    await visitorsPage.goto();
    await visitorsPage.createVisitor(expired);

    // Assert
    await expect(visitorsPage.errorAlert).toContainText(
      /fecha de vencimiento debe estar en el futuro/i,
    );
  });

  const cases: Array<{ label: string; fullName: string }> = [
    { label: "uno", fullName: "Visitante DDT Uno" },
    { label: "dos", fullName: "Visitante DDT Dos" },
    { label: "tres", fullName: "Visitante DDT Tres" },
  ];

  for (const c of cases) {
    test(`CP-05 DDT crea visitante ${c.label}`, async ({ visitorsPage }) => {
      // Arrange
      const visitor: VisitorData = {
        fullName: c.fullName,
        email: `e2e-ddt-${c.label}-${Date.now()}@upc.edu.co`,
        password: "Temporal123!",
        expiresAt: "2030-12-31T23:59",
      };

      // Act
      await visitorsPage.goto();
      await visitorsPage.createVisitor(visitor);

      // Assert
      await expect(visitorsPage.successMessage).toContainText(c.fullName);
    });
  }
});
