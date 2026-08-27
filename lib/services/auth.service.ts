import { apiClient } from "@/lib/api-client";
import type { PublicTokenInfo, UserRead, UserRegister } from "@/types/api";

export const authService = {
  register(payload: UserRegister) {
    return apiClient.post<UserRead>("auth/register", { json: payload });
  },

  login(email: string, password: string) {
    return apiClient.post<PublicTokenInfo>("auth/login", {
      form: { username: email, password },
    });
  },

  refresh() {
    return apiClient.post<PublicTokenInfo>("auth/refresh", { json: {} });
  },

  logout() {
    return apiClient.post<void>("auth/logout", { json: {} });
  },

  me() {
    return apiClient.get<UserRead>("auth/me");
  },
};
