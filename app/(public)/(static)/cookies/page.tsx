import type { Metadata } from "next";
import { InstitutionalPage, InstitutionalSection } from "@/components/public/institutional-page";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Uso de cookies esenciales para la autenticación y seguridad de la plataforma institucional.",
};

export default function CookiesPage() {
  return (
    <InstitutionalPage eyebrow="SEGURIDAD DE SESIÓN" title="Política de cookies" description="La plataforma utiliza cookies técnicas esenciales para mantener una sesión administrativa segura y prestar sus funcionalidades protegidas.">
      <InstitutionalSection title="Cookies esenciales"><p>Se utilizan cookies de sesión para identificar una autenticación válida, proteger las solicitudes y mantener el acceso mientras el usuario usa la plataforma. No se emplean para publicidad ni seguimiento comercial.</p></InstitutionalSection>
      <InstitutionalSection title="Protección"><p>Las cookies de autenticación se configuran con medidas de seguridad, incluyendo acceso restringido desde el navegador cuando corresponde. El cierre de sesión elimina las credenciales de sesión de la plataforma.</p></InstitutionalSection>
      <InstitutionalSection title="Gestión desde el navegador"><p>Deshabilitar o eliminar estas cookies puede impedir el inicio de sesión o el funcionamiento adecuado de las áreas privadas. La configuración se puede administrar desde las preferencias del navegador.</p></InstitutionalSection>
    </InstitutionalPage>
  );
}
