import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center shadow-sm">
        <span className="text-sm font-medium text-muted-foreground">404</span>

        <h1 className="text-3xl font-bold tracking-tight">
          Página no encontrada
        </h1>

        <p className="text-muted-foreground">
          La página que buscas no existe o fue movida.
        </p>

        <Button className="mt-2">
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
