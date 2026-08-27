"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Clock3, LogIn, LogOut, Users } from "lucide-react";
import { useAllAccessEvents } from "@/hooks/use-access-events";
import { useAuth } from "@/components/providers/auth-provider";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AccessEventRead } from "@/types/api";

const activityChartConfig = {
  entries: {
    label: "Entradas",
    color: "var(--primary)",
  },
  exits: {
    label: "Salidas",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

const operatorChartConfig = {
  events: {
    label: "Eventos registrados",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

function localDay(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function analyzeEvents(events: AccessEventRead[]) {
  const hourData = Array.from({ length: 24 }, (_, hour) => ({
    hour: `${String(hour).padStart(2, "0")}:00`,
    entries: 0,
    exits: 0,
  }));

  const validEvents = events.filter(
    (event) => !Number.isNaN(new Date(event.recorded_at).valueOf()),
  );

  const latest = validEvents.reduce<Date | null>((current, event) => {
    const date = new Date(event.recorded_at);

    return !current || date > current ? date : current;
  }, null);

  const dayMap = new Map<
    string,
    {
      date: Date;
      entries: number;
      exits: number;
    }
  >();

  if (latest) {
    for (let index = 6; index >= 0; index -= 1) {
      const date = new Date(latest);

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - index);

      dayMap.set(localDay(date), {
        date,
        entries: 0,
        exits: 0,
      });
    }
  }

  const operatorTotals = new Map<string, number>();

  let entries = 0;
  let exits = 0;

  for (const event of validEvents) {
    const date = new Date(event.recorded_at);
    const property = event.event_type === "entry" ? "entries" : "exits";

    hourData[date.getHours()][property] += 1;

    if (event.event_type === "entry") {
      entries += 1;
    } else {
      exits += 1;
    }

    const day = dayMap.get(localDay(date));

    if (day) {
      day[property] += 1;
    }

    operatorTotals.set(
      event.recorded_by_user_id,
      (operatorTotals.get(event.recorded_by_user_id) ?? 0) + 1,
    );
  }

  const peak = hourData.reduce((current, hour) =>
    hour.entries + hour.exits > current.entries + current.exits
      ? hour
      : current,
  );

  return {
    total: validEvents.length,
    entries,
    exits,
    peak,

    days: [...dayMap.values()].map((day) => ({
      day: day.date.toLocaleDateString("es-CO", {
        weekday: "short",
        day: "numeric",
      }),
      entries: day.entries,
      exits: day.exits,
    })),

    hours: hourData,

    operators: [...operatorTotals.entries()]
      .map(([operator, events]) => ({
        operator: `${operator.slice(0, 8)}…`,
        events,
      }))
      .sort((first, second) => second.events - first.events)
      .slice(0, 8),

    latest,
  };
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Clock3;
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <Card size="sm" className="min-w-0">
      <CardContent className="gap-1">
        <div className="flex items-center justify-between gap-2 text-muted-foreground">
          <span className="truncate">{label}</span>
          <Icon className="size-4 shrink-0" />
        </div>

        <div className="truncate text-2xl font-semibold tabular-nums">
          {value}
        </div>

        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

export function AccessReports() {
  const { user } = useAuth();

  const { events, loading, error, reload } = useAllAccessEvents({
    limit: 200,
  });

  const data = useMemo(() => analyzeEvents(events), [events]);

  const isAdmin = user?.role === "admin";

  const periodLabel = data.latest
    ? `Datos recientes hasta ${data.latest.toLocaleDateString("es-CO", {
        dateStyle: "medium",
      })}`
    : "Sin eventos disponibles";

  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Preparando reportes de acceso...
      </p>
    );
  }

  if (error) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-destructive">
          No fue posible cargar los reportes.
        </p>

        <Button size="sm" variant="outline" onClick={reload}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!events.length) {
    return (
      <p className="text-sm text-muted-foreground">
        Aún no hay registros suficientes para generar reportes.
      </p>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* =========================
          MÉTRICAS
      ========================== */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          icon={BarChart3}
          label="Eventos analizados"
          value={data.total}
          detail="Últimos 200 registros disponibles"
        />

        <MetricCard
          icon={LogIn}
          label="Entradas"
          value={data.entries}
          detail="Registros del período analizado"
        />

        <MetricCard
          icon={LogOut}
          label="Salidas"
          value={data.exits}
          detail="Registros del período analizado"
        />

        <MetricCard
          icon={Clock3}
          label="Hora de mayor flujo"
          value={data.peak.hour}
          detail={`${data.peak.entries + data.peak.exits} eventos registrados`}
        />
      </div>

      {/* =========================
          GRÁFICOS
      ========================== */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Comportamiento diario */}
        <Card className="min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle>Comportamiento diario</CardTitle>

            <p className="text-sm text-muted-foreground">
              Entradas y salidas durante los últimos siete días del período
              observado. {periodLabel}.
            </p>
          </CardHeader>

          <CardContent className="min-w-0">
            <ChartContainer
              config={activityChartConfig}
              className="aspect-auto h-70 w-full min-w-0"
            >
              <BarChart
                accessibilityLayer
                data={data.days}
                margin={{
                  left: 4,
                  right: 4,
                }}
              >
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />

                <ChartTooltip content={<ChartTooltipContent />} />

                <ChartLegend content={<ChartLegendContent />} />

                <Bar
                  dataKey="entries"
                  fill="var(--color-entries)"
                  radius={[4, 4, 0, 0]}
                />

                <Bar
                  dataKey="exits"
                  fill="var(--color-exits)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Picos horarios */}
        <Card className="min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle>Picos horarios de acceso</CardTitle>

            <p className="text-sm text-muted-foreground">
              Distribución de los eventos por hora para identificar franjas de
              mayor movimiento.
            </p>
          </CardHeader>

          <CardContent className="min-w-0">
            <ChartContainer
              config={activityChartConfig}
              className="aspect-auto h-70 w-full min-w-0"
            >
              <LineChart
                accessibilityLayer
                data={data.hours}
                margin={{
                  left: 4,
                  right: 4,
                }}
              >
                <CartesianGrid vertical={false} />

                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={2}
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                />

                <ChartTooltip
                  content={<ChartTooltipContent indicator="line" />}
                />

                <ChartLegend content={<ChartLegendContent />} />

                <Line
                  type="monotone"
                  dataKey="entries"
                  stroke="var(--color-entries)"
                  strokeWidth={2}
                  dot={false}
                />

                <Line
                  type="monotone"
                  dataKey="exits"
                  stroke="var(--color-exits)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Actividad por responsable */}
        {isAdmin && (
          <Card className="min-w-0 overflow-hidden xl:col-span-2">
            <CardHeader>
              <CardTitle>Actividad por responsable</CardTitle>

              <p className="text-sm text-muted-foreground">
                Vista administrativa de los ocho responsables con más registros
                en el conjunto analizado.
              </p>
            </CardHeader>

            <CardContent className="min-w-0">
              <ChartContainer
                config={operatorChartConfig}
                className="aspect-auto h-70 w-full min-w-0"
              >
                <BarChart
                  accessibilityLayer
                  data={data.operators}
                  layout="vertical"
                  margin={{
                    left: 8,
                    right: 4,
                  }}
                >
                  <CartesianGrid horizontal={false} />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="operator"
                    tickLine={false}
                    axisLine={false}
                    width={76}
                  />

                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                  <Bar
                    dataKey="events"
                    fill="var(--color-events)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* =========================
          MENSAJE NO ADMIN
      ========================== */}
      {!isAdmin && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="size-4 shrink-0" />
          <span>
            Los indicadores por responsable están disponibles únicamente para
            administradores.
          </span>
        </p>
      )}
    </div>
  );
}
