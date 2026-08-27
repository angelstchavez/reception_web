"use client";

import { AccessEventsTable } from "@/components/private/admin/access-event-table";
import { useAllAccessEvents } from "@/hooks/use-access-events";


export default function EventsPage() {
  const { events, loading, error, reload } = useAllAccessEvents({ limit: 100 });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Eventos de acceso</h1>
        <p className="text-sm text-muted-foreground">
          Entradas y salidas de todo el sistema, más recientes primero.
        </p>
      </div>
      <AccessEventsTable
        events={events}
        loading={loading}
        error={error}
        onRetry={reload}
        showUserColumn
      />
    </div>
  );
}
