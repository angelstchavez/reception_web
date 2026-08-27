import type { Metadata } from "next";
import { InstitutionalPage, InstitutionalSection } from "@/components/public/institutional-page";

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Condiciones de uso administrativo de la plataforma institucional de control de acceso.",
};

export default function TermsPage() {
  return (
    <InstitutionalPage eyebrow="USO INSTITUCIONAL" title="Términos de uso" description="El acceso a esta plataforma está reservado para personal autorizado de la Universidad Popular del Cesar que requiera sus funciones administrativas de control de acceso.">
      <InstitutionalSection title="Uso autorizado"><p>Las credenciales son personales e intransferibles. Cada usuario debe utilizar la plataforma exclusivamente para las actividades asignadas por la Universidad y de acuerdo con su rol.</p></InstitutionalSection>
      <InstitutionalSection title="Responsabilidades"><p>Está prohibido consultar, divulgar, modificar o utilizar la información para fines ajenos a la operación institucional. Cualquier actividad debe respetar la confidencialidad de los registros y los protocolos de seguridad vigentes.</p></InstitutionalSection>
      <InstitutionalSection title="Seguridad de la cuenta"><p>El usuario debe proteger su contraseña, cerrar sesión al finalizar su actividad y reportar de inmediato cualquier uso no autorizado, pérdida de acceso o comportamiento anómalo.</p></InstitutionalSection>
      <InstitutionalSection title="Administración del servicio"><p>La Universidad puede actualizar funcionalidades, roles, medidas de seguridad y estas condiciones cuando sea necesario para garantizar la correcta operación del sistema.</p></InstitutionalSection>
    </InstitutionalPage>
  );
}
