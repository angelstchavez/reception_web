import type { ReactNode } from "react";
import { Building2, ShieldCheck } from "lucide-react";

interface InstitutionalPageProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function InstitutionalPage({
  eyebrow,
  title,
  description,
  children,
}: InstitutionalPageProps) {
  return (
    <section className="bg-muted/40 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="rounded-2xl border bg-card p-7 shadow-sm sm:p-10">
          <div className="mb-8 flex items-center gap-3 text-primary">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <ShieldCheck className="size-5" aria-hidden="true" />
            </div>
            <div className="text-xs font-semibold tracking-[0.16em] uppercase">
              {eyebrow}
            </div>
          </div>
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
          <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">
            {children}
          </div>
          <div className="mt-10 flex items-center gap-3 border-t pt-6 text-xs text-muted-foreground">
            <Building2 className="size-4 text-primary" aria-hidden="true" />
            Universidad Popular del Cesar · Plataforma institucional de uso administrativo.
          </div>
        </div>
      </div>
    </section>
  );
}

export function InstitutionalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold text-foreground">{title}</h2>
      {children}
    </section>
  );
}
