import { describe, it, expect } from "vitest";
import {
  ROUTE_ACCESS,
  homeForRole,
  getAccessibleRoutes,
  hasRouteAccess,
} from "@/lib/roles";
import type { Role } from "@/types/api";

describe("roles", () => {
  it("homeForRole siempre aterriza en /dashboard tras login", () => {
    // Arrange / Act
    const home = homeForRole();

    // Assert
    expect(home).toBe("/dashboard");
  });

  it("ROUTE_ACCESS restringe /users solo a admin", () => {
    // Arrange
    const allowed = ROUTE_ACCESS["/users"];

    // Act / Assert
    expect(allowed).toEqual(["admin"]);
  });

  it("ROUTE_ACCESS permite /reports a admin y guard (no visitors)", () => {
    // Arrange
    const allowed = ROUTE_ACCESS["/reports"];

    // Act / Assert
    expect(allowed).toContain("admin");
    expect(allowed).toContain("guard");
    expect(allowed).not.toContain("visitor");
  });

  describe("getAccessibleRoutes", () => {
    it("devuelve las rutas donde el rol aparece en la whitelist", () => {
      // Arrange
      const role: Role = "guard";

      // Act
      const routes = getAccessibleRoutes(role).sort();

      // Assert
      expect(routes).toEqual(
        ["/reports", "/dashboard/events", "/dashboard", "/visitors"].sort(),
      );
    });

    it("admin tiene más rutas que student (jerarquía de permisos)", () => {
      // Arrange
      const adminRoutes = getAccessibleRoutes("admin");
      const studentRoutes = getAccessibleRoutes("student");

      // Act / Assert
      expect(adminRoutes.length).toBeGreaterThan(studentRoutes.length);
      expect(studentRoutes).toEqual(["/dashboard"]);
    });

    it("devuelve [] para un rol sin accesos (caso límite)", () => {
      // Arrange
      const role = "desconocido" as Role;

      // Act
      const routes = getAccessibleRoutes(role);

      // Assert
      expect(routes).toEqual([]);
    });
  });

  describe("hasRouteAccess", () => {
    it("retorna true si el rol está en la whitelist de la ruta", () => {
      // Arrange / Act
      const allowed = hasRouteAccess("admin", "/users");

      // Assert
      expect(allowed).toBe(true);
    });

    it("retorna false si la ruta es desconocida", () => {
      // Arrange / Act
      const allowed = hasRouteAccess("admin", "/ruta-inexistente");

      // Assert
      expect(allowed).toBe(false);
    });
  });
});
