"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardCheck, Search } from "lucide-react"
import { attendanceService, type AttendanceAlert, type AttendanceEvent } from "@/lib/services/attendance.service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fetchEvents = () => attendanceService.list({ limit: 100 })
const fetchAlerts = () => attendanceService.listAlerts({ limit: 100 })

export default function AttendancePage() {
  const [query, setQuery] = useState("")
  const { data: events = [], isLoading } = useSWR<AttendanceEvent[]>("attendance-events", fetchEvents)
  const { data: alerts = [] } = useSWR<AttendanceAlert[]>("attendance-alerts", fetchAlerts)
  const filtered = useMemo(() => events.filter((event) => `${event.student_name ?? ""} ${event.group_name ?? ""} ${event.subject_name ?? ""}`.toLowerCase().includes(query.toLowerCase())), [events, query])
  const present = events.filter((event) => event.event_type?.toLowerCase().includes("present") || event.status?.toLowerCase() === "present").length

  return <main className="flex flex-col gap-6">
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div><div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary"><ClipboardCheck className="size-4" /> Operación académica</div><h1 className="text-3xl font-semibold tracking-tight">Asistencia</h1><p className="text-muted-foreground">Consulta eventos de clase y alertas de discrepancia sincronizadas con la API.</p></div>
      <Button variant="outline"><CalendarDays data-icon="inline-start" /> Ver sesiones</Button>
    </header>
    <section className="grid gap-4 md:grid-cols-3"><Metric title="Eventos registrados" value={events.length} icon={ClipboardCheck} /><Metric title="Presentes" value={present} icon={CheckCircle2} /><Metric title="Alertas abiertas" value={alerts.filter((alert) => !alert.resolved).length} icon={AlertTriangle} /></section>
    <Card><CardHeader><CardTitle>Registro académico</CardTitle><CardDescription>Filtra por estudiante, grupo o asignatura.</CardDescription><div className="relative mt-3 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar estudiante, grupo o asignatura" className="pl-9" /></div></CardHeader><CardContent><Tabs defaultValue="events"><TabsList><TabsTrigger value="events">Eventos ({filtered.length})</TabsTrigger><TabsTrigger value="alerts">Alertas ({alerts.length})</TabsTrigger></TabsList><TabsContent value="events" className="mt-4"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="px-3 py-3 font-medium">Estudiante</th><th className="px-3 py-3 font-medium">Grupo</th><th className="px-3 py-3 font-medium">Asignatura</th><th className="px-3 py-3 font-medium">Evento</th><th className="px-3 py-3 font-medium">Fecha</th></tr></thead><tbody>{isLoading ? <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">Cargando eventos...</td></tr> : filtered.map((event) => <tr key={event.id} className="border-b last:border-0"><td className="px-3 py-3 font-medium">{event.student_name ?? event.student_id ?? "Sin identificar"}</td><td className="px-3 py-3">{event.group_name ?? "—"}</td><td className="px-3 py-3">{event.subject_name ?? "—"}</td><td className="px-3 py-3"><Badge variant={event.event_type?.toLowerCase().includes("present") ? "default" : "secondary"}>{event.event_type ?? event.status ?? "Registrado"}</Badge></td><td className="px-3 py-3 text-muted-foreground">{event.occurred_at ? new Date(event.occurred_at).toLocaleString("es-MX") : "—"}</td></tr>)}</tbody></table></div></TabsContent><TabsContent value="alerts" className="mt-4"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="px-3 py-3 font-medium">Estudiante</th><th className="px-3 py-3 font-medium">Motivo</th><th className="px-3 py-3 font-medium">Fecha</th><th className="px-3 py-3 font-medium">Estado</th></tr></thead><tbody>{alerts.map((alert) => <tr key={alert.id} className="border-b last:border-0"><td className="px-3 py-3 font-medium">{alert.student_name ?? alert.student_id ?? "Sin identificar"}</td><td className="px-3 py-3">{alert.reason ?? "Discrepancia de asistencia"}</td><td className="px-3 py-3 text-muted-foreground">{alert.created_at ? new Date(alert.created_at).toLocaleDateString("es-MX") : "—"}</td><td className="px-3 py-3"><Badge variant={alert.resolved ? "secondary" : "destructive"}>{alert.resolved ? "Resuelta" : "Pendiente"}</Badge></td></tr>)}</tbody></table></div></TabsContent></Tabs></CardContent></Card>
  </main>
}

function Metric({ title, value, icon: Icon }: { title: string; value: number; icon: typeof ClipboardCheck }) { return <Card><CardContent className="flex items-center justify-between p-5"><div><p className="text-sm text-muted-foreground">{title}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div><div className="rounded-xl bg-primary/10 p-3 text-primary"><Icon className="size-5" /></div></CardContent></Card> }
