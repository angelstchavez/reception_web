import type { Role } from "@/types/api";

export type RoleType = Role;

export const ROUTE_ACCESS: Record<string, RoleType[]> = {
  "/reports": ["admin", "guard"],
  "/dashboard/events": ["admin", "guard"],
  "/dashboard": ["admin", "guard", "student", "professor", "visitor"],
  "/visitors": ["admin", "guard"],
  "/users": ["admin"],
};

export function homeForRole(): string {
  return "/dashboard";
}

export function getAccessibleRoutes(role: RoleType): string[] {
  return Object.entries(ROUTE_ACCESS)
    .filter(([, roles]) => roles.includes(role))
    .map(([route]) => route);
}

export function hasRouteAccess(role: RoleType, route: string): boolean {
  return getAccessibleRoutes(role).includes(route);
}
