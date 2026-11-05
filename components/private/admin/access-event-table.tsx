"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ApiError } from "@/lib/api-client";
import type { AccessEventRead } from "@/types/api";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface Props {
  events: AccessEventRead[];
  loading: boolean;
  error: ApiError | null;
  onRetry: () => void;
  showUserColumn?: boolean;
}

export function AccessEventsTable({
  events,
  loading,
  error,
  onRetry,
  showUserColumn = true,
}: Props) {
  const [query, setQuery] = useState("");
  const [direction, setDirection] = useState<"all" | "entry" | "exit">("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesDirection = direction === "all" || event.event_type === direction;
    const searchable = `${event.id} ${event.user_id} ${event.recorded_by_user_id}`.toLowerCase();
    return matchesDirection && searchable.includes(query.toLowerCase().trim());
  }), [direction, events, query]);
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const visibleEvents = filteredEvents.slice((page - 1) * pageSize, page * pageSize);
  const firstResult = filteredEvents.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastResult = Math.min(page * pageSize, filteredEvents.length);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando eventos...</p>;
  }

  if (error) {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-destructive">
          No se pudieron cargar los eventos.
        </p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay eventos registrados.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/70 p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input aria-label="Buscar eventos" value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Buscar por usuario o responsable" className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring" />
        </div>
        <div className="flex items-center gap-1 rounded-lg bg-muted/50 p-1">
          <Filter className="mx-2 size-3.5 text-muted-foreground" />
          {([['all', 'Todos'], ['entry', 'Entradas'], ['exit', 'Salidas']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => { setDirection(value); setPage(1); }} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${direction === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>{label}</button>)}
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/70">
      <Table>
      <TableHeader>
        <TableRow>
          {showUserColumn && <TableHead>Usuario</TableHead>}
          <TableHead>Dirección</TableHead>
          <TableHead>Registrado por</TableHead>
          <TableHead className="text-right">Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {visibleEvents.map((event) => (
          <TableRow key={event.id}>
            {showUserColumn && (
              <TableCell className="font-mono text-xs">
                {event.user_id}
              </TableCell>
            )}
            <TableCell>
              <Badge
                variant={event.event_type === "entry" ? "default" : "secondary"}
              >
                {event.event_type === "entry" ? "Entrada" : "Salida"}
              </Badge>
            </TableCell>
            <TableCell className="font-mono text-xs">
              {event.recorded_by_user_id}
            </TableCell>
            <TableCell className="text-right">
              {formatDateTime(event.recorded_at)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      </Table>
      {filteredEvents.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">No hay eventos que coincidan con los filtros.</p>}
      </div>
      <div className="flex flex-col gap-3 border-t border-border/60 pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Mostrando <span className="font-medium text-foreground">{firstResult}-{lastResult}</span> de <span className="font-medium text-foreground">{filteredEvents.length}</span> eventos</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1} aria-label="Página anterior"><ChevronLeft data-icon="inline-start" />Anterior</Button>
          <span className="min-w-20 text-center text-xs font-medium text-foreground">Página {page} de {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page >= totalPages} aria-label="Página siguiente">Siguiente<ChevronRight data-icon="inline-end" /></Button>
        </div>
      </div>
    </div>
  );
}
