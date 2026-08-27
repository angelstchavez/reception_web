"use client";

import { AccessEventsTable } from "@/components/private/admin/access-event-table";
import { useMyAccessEvents } from "@/hooks/use-access-events";

export default function DashboardPage() {
  const { events, loading, error, reload } = useMyAccessEvents({ limit: 50 });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Mi historial de acceso</h1>
        <p className="text-sm text-muted-foreground">
          Tus últimas entradas y salidas registradas por el sistema.
        </p>
      </div>
      <AccessEventsTable
        events={events}
        loading={loading}
        error={error}
        onRetry={reload}
        showUserColumn={false}
      />
    </div>
  );
}
