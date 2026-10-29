import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/env";
import { ArrowRight, BadgeCheck, Building2, ClipboardList, GalleryVerticalEnd, LockKeyhole, ShieldCheck, UsersRound } from "lucide-react";

export const metadata: Metadata = {
  title: "Control de acceso institucional",
  description: "Supervisa los accesos institucionales de la Universidad Popular del Cesar desde un solo lugar.",
};

const features = [
  { icon: ClipboardList, title: "Trazabilidad clara", description: "Consulta entradas y salidas con información ordenada para tomar decisiones oportunas." },
  { icon: UsersRound, title: "Gestión centralizada", description: "Administra usuarios, visitantes y vehículos desde módulos conectados." },
  { icon: ShieldCheck, title: "Protección por roles", description: "Cada persona ve únicamente las herramientas que necesita para su función." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-emerald-950/10 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label={`${APP_NAME}, inicio`}>
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20"><GalleryVerticalEnd className="size-4" aria-hidden="true" /></span>
            <span className="text-base font-semibold tracking-tight">{APP_NAME}</span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Navegación principal">
            <Link href="/contact" className="hidden px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">Soporte</Link>
            <Link href="/login"><Button size="sm">Ingresar <ArrowRight data-icon="inline-end" /></Button></Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-emerald-950/10 bg-[radial-gradient(circle_at_78%_20%,oklch(0.86_0.12_145/.45),transparent_35%),linear-gradient(135deg,oklch(0.98_0.02_145),var(--background)_55%)]">
          <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
            <div>
              <Badge variant="outline" className="border-primary/25 bg-background/70 px-3 py-1 text-primary shadow-sm"><Building2 data-icon="inline-start" /> Universidad Popular del Cesar</Badge>
              <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">Un campus conectado, seguro y fácil de supervisar.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{APP_NAME} reúne la información operativa del control de acceso institucional para que tu equipo pueda consultar, gestionar y actuar con confianza.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link href="/login"><Button size="lg">Acceso administrativo <ArrowRight data-icon="inline-end" /></Button></Link><Link href="/contact"><Button variant="outline" size="lg">Conocer soporte</Button></Link></div>
              <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground"><span className="flex size-7 items-center justify-center rounded-full bg-primary/12 text-primary"><BadgeCheck className="size-4" /></span><span>Plataforma protegida para personal autorizado</span></div>
            </div>
            <div className="relative rounded-3xl border border-emerald-900/10 bg-card/90 p-4 shadow-2xl shadow-emerald-900/10 backdrop-blur sm:p-6">
              <div className="rounded-2xl bg-primary p-6 text-primary-foreground"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-primary-foreground/75">Panel institucional</p><p className="mt-2 text-2xl font-semibold">Todo bajo control</p></div><span className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/15"><ShieldCheck className="size-5" /></span></div><div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-xl bg-primary-foreground/10 p-4"><p className="text-xs text-primary-foreground/70">Accesos hoy</p><p className="mt-1 text-2xl font-semibold">1.248</p></div><div className="rounded-xl bg-primary-foreground/10 p-4"><p className="text-xs text-primary-foreground/70">Personal activo</p><p className="mt-1 text-2xl font-semibold">386</p></div></div></div>
              <div className="grid gap-3 p-2 pt-5 sm:grid-cols-3"><div className="rounded-xl bg-muted/60 p-3"><ClipboardList className="size-4 text-primary" /><p className="mt-2 text-xs font-medium">Eventos</p></div><div className="rounded-xl bg-muted/60 p-3"><UsersRound className="size-4 text-primary" /><p className="mt-2 text-xs font-medium">Usuarios</p></div><div className="rounded-xl bg-muted/60 p-3"><LockKeyhole className="size-4 text-primary" /><p className="mt-2 text-xs font-medium">Acceso seguro</p></div></div>
            </div>
          </div>
        </section>
        <section className="mx-auto w-full max-w-7xl px-6 py-18 lg:px-8 lg:py-24"><div className="max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Diseñado para operar mejor</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">La información correcta, en el momento correcto.</h2><p className="mt-4 text-muted-foreground">Una experiencia sencilla para equipos de vigilancia y administración que necesitan claridad sin pasos innecesarios.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"><span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article>)}</div></section>
      </main>
      <footer className="border-t bg-muted/30"><div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-muted-foreground sm:flex-row lg:px-8"><p>© {new Date().getFullYear()} {APP_NAME}</p><div className="flex gap-4"><Link href="/privacy" className="hover:text-foreground">Privacidad</Link><Link href="/terms" className="hover:text-foreground">Términos</Link><Link href="/contact" className="hover:text-foreground">Contacto</Link></div></div></footer>
    </div>
  );
}
