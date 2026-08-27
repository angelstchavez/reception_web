import type { Metadata } from "next";
import { InstitutionalPage, InstitutionalSection } from "@/components/public/institutional-page";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Información sobre el tratamiento de datos personales en la plataforma institucional de control de acceso.",
};

export default function PrivacyPage() {
  return (
    <InstitutionalPage eyebrow="PRIVACIDAD Y DATOS PERSONALES" title="Política de privacidad" description="Esta plataforma es de uso administrativo exclusivo de la Universidad Popular del Cesar y trata información necesaria para apoyar el control y la supervisión de los accesos institucionales.">
      <InstitutionalSection title="Información tratada"><p>La plataforma puede tratar datos de identificación institucional, rol de acceso y registros de entrada o salida asociados a credenciales digitales. Se recopila únicamente la información requerida para operar, auditar y proteger el servicio.</p></InstitutionalSection>
      <InstitutionalSection title="Finalidad institucional"><p>Los datos se utilizan para verificar autorizaciones, consultar trazabilidad de accesos, gestionar usuarios y visitantes temporales, atender incidentes de seguridad y cumplir las obligaciones aplicables de la Universidad.</p></InstitutionalSection>
      <InstitutionalSection title="Acceso y conservación"><p>El acceso está restringido a personal autorizado según su función. La información se conserva durante el tiempo necesario para las finalidades institucionales, las obligaciones legales y los procedimientos internos vigentes.</p></InstitutionalSection>
      <InstitutionalSection title="Derechos y solicitudes"><p>Para consultas o solicitudes relacionadas con datos personales, utiliza los canales institucionales de la Universidad Popular del Cesar o contacta al área responsable de soporte y tecnología.</p></InstitutionalSection>
    </InstitutionalPage>
  );
}
