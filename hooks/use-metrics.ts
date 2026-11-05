"use client";

import useSWR from "swr";
import { metricsService } from "@/lib/services/metrics.service";

export function useMetrics() {
  const access = useSWR("metrics/access", () => metricsService.access());
  const vehicles = useSWR("metrics/vehicles", () => metricsService.vehicles());
  const attendance = useSWR("metrics/attendance", () => metricsService.attendance());

  return {
    access: access.data,
    vehicles: vehicles.data,
    attendance: attendance.data,
    loading: access.isLoading || vehicles.isLoading || attendance.isLoading,
    error: access.error || vehicles.error || attendance.error,
    reload: () => Promise.all([access.mutate(), vehicles.mutate(), attendance.mutate()]),
  };
}
