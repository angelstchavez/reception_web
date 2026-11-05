import { apiClient } from "@/lib/api-client";

export interface CatalogItem { id: string; name?: string; code?: string; identifier?: string; location?: string; is_active: boolean; created_at: string; [key: string]: unknown }
export const catalogService = {
  list(resource: string, params?: { is_active?: boolean; limit?: number; offset?: number }) { return apiClient.get<CatalogItem[]>(resource, { params: params ? { ...params } : undefined }); },
  create(resource: string, payload: Record<string, unknown>) { return apiClient.post<CatalogItem>(resource, { json: payload }); },
  toggle(resource: string, id: string, active: boolean) { return apiClient.post<CatalogItem>(`${resource}/${id}/${active ? "deactivate" : "activate"}`); },
};
