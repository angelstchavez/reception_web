/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Role } from "@/types/api";

export type RoleType = Role;

export const ROUTE_ACCESS: Record<string, RoleType[]> = {
  "/dashboard": ["admin", "guard", "student", "professor", "visitor"],
  "/scan": ["admin", "guard"],
  "/events": ["admin", "guard"],
  "/visitors": ["admin", "guard"],
  "/users": ["admin"],
};

export function homeForRole(_role: RoleType): string {
  return "/dashboard";
}
