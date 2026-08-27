import type { Metadata } from "next";
import { Mail, ShieldAlert, Wrench } from "lucide-react";
import { InstitutionalPage, InstitutionalSection } from "@/components/public/institutional-page";

export const metadata: Metadata = {
  title: "Soporte institucional",
  description: "Canales institucionales para solicitar soporte sobre la plataforma de control de acceso.",
};

export default function ContactPage() {
  return (
    <InstitutionalPage eyebrow="SOPORTE INSTITUCIONAL" title="Contacto y soporte" description="Para recibir asistencia sobre el acceso a la plataforma, comunícate con los canales oficiales de la Universidad Popular del Cesar.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border bg-muted/30 p-5"><Wrench className="size-5 text-primary" /><h2 className="mt-3 font-semibold text-foreground">Soporte técnico</h2><p className="mt-2">Reporta inconvenientes de inicio de sesión, permisos o funcionamiento de la plataforma a la dependencia de tecnología de la Universidad.</p></div>
        <div className="rounded-xl border bg-muted/30 p-5"><ShieldAlert className="size-5 text-primary" /><h2 className="mt-3 font-semibold text-foreground">Incidentes de seguridad</h2><p className="mt-2">Informa de inmediato cualquier acceso no autorizado, pérdida de credenciales o actividad que requiera revisión.</p></div>
      </div>
      <InstitutionalSection title="Canal de atención"><p className="flex items-center gap-2"><Mail className="size-4 text-primary" aria-hidden="true" />Utiliza el correo y la mesa de ayuda institucionales asignados por la Universidad Popular del Cesar.</p></InstitutionalSection>
      <InstitutionalSection title="Información útil al reportar"><p>Incluye tu nombre institucional, área o dependencia, descripción del caso, fecha y hora aproximada. No compartas contraseñas, tokens ni información sensible en el reporte.</p></InstitutionalSection>
    </InstitutionalPage>
  );
}
