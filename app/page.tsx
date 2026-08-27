import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/env";
import {
  BadgeCheck,
  Building2,
  ClipboardList,
  GalleryVerticalEnd,
  LockKeyhole,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Control de acceso institucional",
  description:
    "Portal administrativo de la Universidad Popular del Cesar para supervisar y consultar los accesos institucionales.",
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="h-4 w-4" />
            </div>

            <h1 className="text-xl font-bold tracking-tight">{APP_NAME}</h1>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button>Iniciar sesión</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="border-b bg-linear-to-br from-primary/10 via-background to-background">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-18 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
            <div>
              <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                <Building2 aria-hidden="true" /> Universidad Popular del Cesar
              </Badge>
              <h2 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Supervisión institucional para un campus más seguro.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                {APP_NAME} centraliza la consulta de accesos registrados mediante credenciales digitales, con información disponible únicamente para personal autorizado de la Universidad Popular del Cesar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login"><Button size="lg">Acceso administrativo</Button></Link>
                <Link href="/contact"><Button variant="outline" size="lg">Soporte institucional</Button></Link>
              </div>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-lg shadow-primary/5">
              <div className="flex items-center justify-between border-b pb-5">
                <div>
                  <p className="text-sm font-medium">Estado de la plataforma</p>
                  <p className="mt-1 text-xs text-muted-foreground">Operación administrativa protegida</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck className="size-5" /></div>
              </div>
              <dl className="mt-5 grid gap-4">
                <div className="rounded-xl bg-muted/70 p-4"><dt className="text-xs font-medium text-muted-foreground">Accesos</dt><dd className="mt-1 flex items-center gap-2 text-sm font-semibold"><ClipboardList className="size-4 text-primary" />Consulta de historial</dd></div>
                <div className="rounded-xl bg-muted/70 p-4"><dt className="text-xs font-medium text-muted-foreground">Gestión</dt><dd className="mt-1 flex items-center gap-2 text-sm font-semibold"><UsersRound className="size-4 text-primary" />Usuarios y visitantes</dd></div>
                <div className="rounded-xl bg-muted/70 p-4"><dt className="text-xs font-medium text-muted-foreground">Protección</dt><dd className="mt-1 flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="size-4 text-primary" />Roles y sesión segura</dd></div>
              </dl>
            </div>
          </div>
        </section>
        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="max-w-2xl"><p className="text-sm font-semibold text-primary">PROPÓSITO INSTITUCIONAL</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">Información oportuna para la vigilancia y el control del acceso.</h2></div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              [BadgeCheck, "Trazabilidad", "Consulta de entradas y salidas registradas, ordenadas para apoyar la supervisión operativa."],
              [UsersRound, "Administración autorizada", "Gestión de cuentas institucionales y de accesos temporales para visitantes."],
              [ShieldCheck, "Uso restringido", "Acceso limitado por roles para preservar la confidencialidad de la información."],
            ].map(([Icon, title, description]) => {
              const FeatureIcon = Icon as typeof BadgeCheck;
              return <article key={title as string} className="rounded-xl border bg-card p-6"><FeatureIcon className="size-5 text-primary" /><h3 className="mt-4 font-semibold">{title as string}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description as string}</p></article>;
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {APP_NAME}. Todos los derechos
            reservados.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacidad
            </Link>
            <Link
              href="/cookies"
              className="transition-colors hover:text-foreground"
            >
              Cookies
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Términos
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-foreground"
            >
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
