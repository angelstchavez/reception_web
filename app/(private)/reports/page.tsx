import type { Metadata } from "next";
import { AccessReports } from "@/components/private/reports/access-reports";

export const metadata: Metadata = {
  title: "Reportes de acceso",
  description: "Indicadores operativos y análisis de los registros de acceso institucional.",
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Reportes de acceso</h1>
        <p className="text-sm text-muted-foreground">Indicadores operativos elaborados a partir de los registros más recientes.</p>
      </div>
      <AccessReports />
    </div>
  );
}
