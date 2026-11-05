import { apiClient } from "@/lib/api-client"

export type AttendanceEvent = {
  id: string
  student_id?: string
  student_name?: string
  group_name?: string
  subject_name?: string
  event_type?: string
  occurred_at?: string
  status?: string
}

export type AttendanceAlert = {
  id: string
  student_id?: string
  student_name?: string
  reason?: string
  created_at?: string
  resolved?: boolean
}

export const attendanceService = {
  list: (params?: { student_id?: string; group_id?: string; schedule_block_id?: string; limit?: number; offset?: number }) =>
    apiClient.get<AttendanceEvent[]>("/class-attendance", params),
  listAlerts: (params?: { student_id?: string; limit?: number; offset?: number }) =>
    apiClient.get<AttendanceAlert[]>("/attendance-alerts", params),
  metrics: (date_from: string, date_to: string) =>
    apiClient.get<Record<string, unknown>>("/metrics/attendance", { date_from, date_to }),
}
