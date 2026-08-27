import { apiClient } from "@/lib/api-client";
import type { UserCreate, UserRead, VisitorCreate } from "@/types/api";

export const usersService = {
  create(payload: UserCreate) {
    return apiClient.post<UserRead>("users", { json: payload });
  },

  createVisitor(payload: VisitorCreate) {
    return apiClient.post<UserRead>("users/visitors", { json: payload });
  },
};
