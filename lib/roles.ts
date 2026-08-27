import type { Role } from "@/types/api";

export type RoleType = Role;

export const ROUTE_ACCESS: Record<string, RoleType[]> = {
  "/dashboard/events": ["admin", "guard"],
  "/dashboard": ["admin", "guard", "student", "professor", "visitor"],
  "/visitors": ["admin", "guard"],
  "/users": ["admin"],
};

export function homeForRole(): string {
  return "/dashboard";
}
