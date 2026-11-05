import { apiClient } from "@/lib/api-client";

export type AccessMetrics = {
  entries_by_hour: Array<{ hour: number; count: number }>;
  exits_by_hour: Array<{ hour: number; count: number }>;
  people_currently_inside: number;
  average_stay_minutes: number | null;
  denied_access_count: number;
  access_by_point: Array<{ access_point_id: string; access_point_name: string; count: number }>;
};

export type VehicleMetrics = {
  total_active: number;
  entries_today: number;
  exits_today: number;
  currently_inside: number;
};

export type AttendanceMetrics = {
  attendance_rate: number;
  present_count: number;
  expected_count: number;
  open_sessions: number;
};

function period() {
  const date = new Date();
  const dateTo = date.toISOString().slice(0, 10);
  const from = new Date(date);
  from.setDate(date.getDate() - 30);
  return { date_from: from.toISOString().slice(0, 10), date_to: dateTo };
}

export const metricsService = {
  access() {
    return apiClient.get<AccessMetrics>("metrics/access", { params: period() });
  },
  vehicles() {
    return apiClient.get<VehicleMetrics>("metrics/vehicles", { params: period() });
  },
  attendance() {
    return apiClient.get<AttendanceMetrics>("metrics/attendance", { params: period() });
  },
};
