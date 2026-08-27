import { ThemeToggle } from "@/components/theme/theme-toggle";
import { APP_NAME } from "@/lib/env";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";

export default function StaticLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="h-4 w-4" />
            </div>

            <h1 className="text-xl font-bold tracking-tight">{APP_NAME}</h1>
          </Link>

          <ThemeToggle />
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1">{children}</main>

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
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Términos
            </Link>
            <Link
              href="/cookies"
              className="transition-colors hover:text-foreground"
            >
              Cookies
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
