import Link from "next/link";
import { LoginForm } from "@/components/public/auth/login/login-form";
import { APP_NAME } from "@/lib/env";
import { GalleryVerticalEnd, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return <main className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
    <section className="relative hidden overflow-hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-28 -top-28 size-96 rounded-full border border-primary-foreground/10" /><div className="absolute -bottom-40 -left-24 size-96 rounded-full border border-primary-foreground/10" />
      <Link href="/" className="relative flex items-center gap-3 text-sm font-semibold"><span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15"><GalleryVerticalEnd className="size-4" /></span>{APP_NAME}</Link>
      <div className="relative max-w-md"><div className="mb-6 flex size-12 items-center justify-center rounded-2xl bg-primary-foreground/15"><ShieldCheck className="size-6" /></div><h1 className="text-4xl font-semibold tracking-tight text-balance">La operación del campus, en buenas manos.</h1><p className="mt-5 leading-7 text-primary-foreground/75">Ingresa al portal para consultar accesos, gestionar usuarios y mantener la información institucional organizada.</p></div>
      <p className="relative text-xs text-primary-foreground/60">Acceso exclusivo para personal autorizado</p>
    </section>
    <section className="flex min-h-screen items-center justify-center bg-muted/30 p-6 md:p-10"><div className="w-full max-w-md"><div className="mb-8 flex items-center justify-center gap-3 lg:hidden"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><GalleryVerticalEnd className="size-4" /></span><span className="font-semibold">{APP_NAME}</span></div><LoginForm /></div></section>
  </main>;
}
