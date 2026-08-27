"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  Clock3,
  LogIn,
  LogOut,
  RefreshCw,
  Users,
} from "lucide-react";
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

const balanceChartConfig = {
  entries: {
    label: "Entradas",
    color: "var(--primary)",
  },
  exits: {
    label: "Salidas",
    color: "var(--muted-foreground)",
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
    { date: Date; entries: number; exits: number }
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

    if (event.event_type === "entry") entries += 1;
    else exits += 1;

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

  const days = [...dayMap.values()].map((day) => ({
    day: day.date.toLocaleDateString("es-CO", {
      weekday: "short",
      day: "numeric",
    }),
    entries: day.entries,
    exits: day.exits,
    total: day.entries + day.exits,
  }));

  const operators = [...operatorTotals.entries()]
    .map(([operator, events]) => ({
      operator: `${operator.slice(0, 8)}…`,
      events,
    }))
    .sort((first, second) => second.events - first.events)
    .slice(0, 8);

  const balance = [
    {
      name: "Entradas",
      value: entries,
      fill: "var(--color-entries)",
    },
    {
      name: "Salidas",
      value: exits,
      fill: "var(--color-exits)",
    },
  ];

  const entryExitRatio = exits > 0 ? entries / exits : entries;
  const netFlow = entries - exits;

  return {
    total: validEvents.length,
    entries,
    exits,
    peak,
    days,
    hours: hourData,
    operators,
    balance,
    entryExitRatio,
    netFlow,
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
    <Card className="min-w-0 border-border/60 bg-card/80 shadow-sm transition-shadow hover:shadow-md">
      <CardContent className="gap-2 p-4">
        <div className="flex items-center justify-between gap-2 text-muted-foreground">
          <span className="truncate text-xs font-medium uppercase tracking-wide">
            {label}
          </span>
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/70">
            <Icon className="size-4" />
          </div>
        </div>

        <div className="truncate text-2xl font-bold tabular-nums tracking-tight">
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

  const [refreshing, setRefreshing] = useState(false);

  const data = useMemo(() => analyzeEvents(events), [events]);
  const isAdmin = user?.role === "admin";

  const periodLabel = data.latest
    ? `Actualizado con datos hasta ${data.latest.toLocaleDateString("es-CO", {
        dateStyle: "medium",
      })}`
    : "Sin eventos disponibles";

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await Promise.resolve(reload());
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed bg-muted/20">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <RefreshCw className="size-4 animate-spin" />
          Preparando reportes de acceso...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <p className="font-medium">No fue posible cargar los reportes.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Comprueba la conexión e intenta actualizar nuevamente.
            </p>
          </div>

          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 size-4" />
            Reintentar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!events.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
            <BarChart3 className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">Aún no hay registros de acceso</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Cuando existan eventos, aquí aparecerán los reportes.
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            <RefreshCw className="mr-2 size-4" />
            Actualizar
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* Encabezado */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Reportes de acceso</h2>
              <p className="text-xs text-muted-foreground">{periodLabel}</p>
            </div>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={handleRefresh}
          disabled={refreshing}
          className="w-full shrink-0 sm:w-auto"
        >
          <RefreshCw
            className={`mr-2 size-4 ${refreshing ? "animate-spin" : ""}`}
          />
          {refreshing ? "Actualizando..." : "Actualizar reportes"}
        </Button>
      </div>

      {/* Métricas */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
          detail="Registros de ingreso"
        />

        <MetricCard
          icon={LogOut}
          label="Salidas"
          value={data.exits}
          detail="Registros de salida"
        />

        <MetricCard
          icon={Clock3}
          label="Hora de mayor flujo"
          value={data.peak.hour}
          detail={`${data.peak.entries + data.peak.exits} eventos registrados`}
        />
      </div>

      {/* Gráficos */}
      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Comportamiento diario */}
        <Card className="min-w-0 overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Comportamiento diario</CardTitle>
            <p className="text-sm text-muted-foreground">
              Entradas y salidas durante los últimos siete días observados.
            </p>
          </CardHeader>

          <CardContent className="min-w-0 pt-2">
            <ChartContainer
              config={activityChartConfig}
              className="aspect-auto h-72 w-full min-w-0"
            >
              <BarChart
                accessibilityLayer
                data={data.days}
                margin={{ left: 4, right: 4, top: 8 }}
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
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="exits"
                  fill="var(--color-exits)"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Picos horarios */}
        <Card className="min-w-0 overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Picos horarios de acceso
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Franjas del día con mayor movimiento de entradas y salidas.
            </p>
          </CardHeader>

          <CardContent className="min-w-0 pt-2">
            <ChartContainer
              config={activityChartConfig}
              className="aspect-auto h-72 w-full min-w-0"
            >
              <LineChart
                accessibilityLayer
                data={data.hours}
                margin={{ left: 4, right: 4, top: 8 }}
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
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="exits"
                  stroke="var(--color-exits)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Actividad por responsable */}
        {isAdmin && (
          <Card className="min-w-0 overflow-hidden border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Actividad por responsable
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Los ocho responsables con más registros en el período analizado.
              </p>
            </CardHeader>

            <CardContent className="min-w-0 pt-2">
              <ChartContainer
                config={operatorChartConfig}
                className="aspect-auto h-72 w-full min-w-0"
              >
                <BarChart
                  accessibilityLayer
                  data={data.operators}
                  layout="vertical"
                  margin={{ left: 8, right: 8, top: 8 }}
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
                    radius={[0, 5, 5, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Nuevo reporte: balance de flujo */}
        <Card className="min-w-0 overflow-hidden border-border/60 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Balance de flujo</CardTitle>
            <p className="text-sm text-muted-foreground">
              Comparación general entre entradas y salidas del período.
            </p>
          </CardHeader>

          <CardContent className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <ChartContainer
              config={balanceChartConfig}
              className="mx-auto aspect-square h-56 w-full max-w-56"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={data.balance}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={86}
                  strokeWidth={2}
                />
              </PieChart>
            </ChartContainer>

            <div className="grid gap-3 sm:min-w-36">
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Balance neto</p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {data.netFlow > 0 ? "+" : ""}
                  {data.netFlow}
                </p>
                <p className="text-xs text-muted-foreground">
                  entradas − salidas
                </p>
              </div>

              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Relación</p>
                <p className="mt-1 text-xl font-bold tabular-nums">
                  {data.entryExitRatio.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  entradas por cada salida
                </p>
              </div>
            </div>

            <div className="col-span-full flex flex-wrap gap-x-5 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-primary" />
                Entradas: {data.entries}
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-muted-foreground" />
                Salidas: {data.exits}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isAdmin && (
        <div className="flex items-start gap-3 rounded-lg border border-dashed bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          <Users className="mt-0.5 size-4 shrink-0" />
          <span>
            Los indicadores por responsable están disponibles únicamente para
            administradores.
          </span>
        </div>
      )}
    </div>
  );
}
