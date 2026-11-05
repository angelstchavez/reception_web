import { apiClient } from "@/lib/api-client";
import type { UserCreate, UserRead, VisitorCreate } from "@/types/api";

export const usersService = {
  create(payload: UserCreate) {
    return apiClient.post<UserRead>("users", { json: payload });
  },

  createVisitor(payload: VisitorCreate) {
    return apiClient.post<UserRead>("users/visitors", { json: payload });
  },

  list(params?: { role?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.role) query.set("role", params.role);
    if (params?.search) query.set("search", params.search);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return apiClient.get<UserRead[]>(`users${suffix}`);
  },
};
