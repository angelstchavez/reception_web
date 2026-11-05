import { apiClient } from "@/lib/api-client";
import type { Role, UserCreate, UserRead, VehicleCreate, VehicleRead } from "@/types/api";

export interface ListParams { limit?: number; offset?: number; }
export interface UserListParams extends ListParams { role?: Role }
export interface VehicleListParams extends ListParams { owner_id?: string }

export const resourcesService = {
  listUsers(params?: UserListParams) {
    return apiClient.get<UserRead[]>("users", { params: params ? { ...params } : undefined });
  },
  createUser(payload: UserCreate) {
    return apiClient.post<UserRead>("users", { json: payload });
  },
  listVehicles(params?: VehicleListParams) {
    return apiClient.get<VehicleRead[]>("vehicles", { params: params ? { ...params } : undefined });
  },
  createVehicle(payload: VehicleCreate) {
    return apiClient.post<VehicleRead>("vehicles", { json: payload });
  },
  updateVehicle(id: string, payload: Partial<VehicleCreate>) {
    return apiClient.patch<VehicleRead>(`vehicles/${id}`, { json: payload });
  },
  activateVehicle(id: string) {
    return apiClient.post<VehicleRead>(`vehicles/${id}/activate`);
  },
  deactivateVehicle(id: string) {
    return apiClient.post<VehicleRead>(`vehicles/${id}/deactivate`);
  },
};
