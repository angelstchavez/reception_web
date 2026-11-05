import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/private/utils/app-sidebar";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-[4.5rem] shrink-0 items-center justify-between border-b border-border/60 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <SidebarTrigger />
            <div className="hidden h-7 w-px bg-border sm:block" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Centro de operaciones</p>
              <p className="truncate text-sm font-medium text-foreground">Control de acceso institucional</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/70 p-1 shadow-sm">
            <span className="hidden rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary sm:inline-flex">Sistema activo</span>
            <ThemeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
