import { apiClient } from "@/lib/api-client";
import type {
  AccessEventRead,
  ListAllEventsParams,
  ListEventsParams,
  ScanRequest,
  ScanResponse,
} from "@/types/api";
import { toQueryParams } from "../utils";

export const accessEventsService = {
  scan(payload: ScanRequest) {
    return apiClient.post<ScanResponse>("access-events/scan", {
      json: payload,
    });
  },

  listMine(params?: ListEventsParams) {
    return apiClient.get<AccessEventRead[]>("access-events/me", {
      params: params ? toQueryParams(params) : undefined,
    });
  },

  listAll(params?: ListAllEventsParams) {
    return apiClient.get<AccessEventRead[]>("access-events", {
      params: params ? toQueryParams(params) : undefined,
    });
  },
};
