"use client";

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
        {events.map((event) => (
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
  );
}
