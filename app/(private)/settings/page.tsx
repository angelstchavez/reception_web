"use client";

import Link from "next/link";
import { Settings2, Shield, SlidersHorizontal, UsersRound, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const catalogs = [
  { name: "Facultades", count: 4, href: "/catalogs?tab=faculties" },
  { name: "Programas académicos", count: 12, href: "/catalogs?tab=programs" },
  { name: "Materias", count: 38, href: "/catalogs?tab=subjects" },
  { name: "Periodos académicos", count: 2, href: "/catalogs?tab=terms" },
  { name: "Aulas", count: 24, href: "/catalogs?tab=classrooms" },
  { name: "Grupos", count: 16, href: "/catalogs?tab=groups" },
  { name: "Puntos de acceso", count: 6, href: "/catalogs?tab=access-points" },
  { name: "Lectores", count: 8, href: "/catalogs?tab=readers" },
];

const rules = [
  ["Validar vigencia de credencial", "Bloquea credenciales vencidas al registrar un acceso."],
  ["Notificar eventos inusuales", "Avisa al equipo cuando un evento requiere revisión."],
  ["Permitir visitantes sin invitación", "Mantiene el registro manual disponible para recepción."],
] as const;

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary"><Settings2 className="size-3.5" /> Configuración</div>
          <h1 className="text-3xl font-semibold tracking-tight">Configuración del sistema</h1>
          <p className="text-muted-foreground">Define catálogos, permisos y reglas operativas de Reception.</p>
        </div>
        <Badge variant="secondary">Cambios guardados automáticamente</Badge>
      </div>

      <Tabs defaultValue="catalogs" className="gap-5">
        <TabsList>
          <TabsTrigger value="catalogs"><SlidersHorizontal data-icon="inline-start" />Catálogos</TabsTrigger>
          <TabsTrigger value="access"><Shield data-icon="inline-start" />Accesos</TabsTrigger>
          <TabsTrigger value="account"><UsersRound data-icon="inline-start" />Cuenta</TabsTrigger>
        </TabsList>
        <TabsContent value="catalogs">
          <Card className="border-border/60 shadow-none">
            <CardHeader><CardTitle>Catálogos institucionales</CardTitle><CardDescription>Administra la información base que usan los módulos académicos.</CardDescription></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {catalogs.map((catalog) => <Link className="group flex items-center justify-between rounded-xl border border-border/60 bg-muted/20 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5" href={catalog.href} key={catalog.name}><div><p className="font-medium">{catalog.name}</p><p className="mt-1 text-xs text-muted-foreground">{catalog.count} registros</p></div><ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /></Link>)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="access">
          <Card className="max-w-2xl border-border/60 shadow-none"><CardHeader><CardTitle>Reglas de acceso</CardTitle><CardDescription>Controles que aplican a los registros de entrada y salida.</CardDescription></CardHeader><CardContent className="flex flex-col gap-1">{rules.map(([title, description], index) => <div className="flex items-center justify-between gap-4 border-b border-border/50 py-4 last:border-0" key={title}><div><Label htmlFor={`rule-${index}`} className="font-medium">{title}</Label><p className="mt-1 text-sm text-muted-foreground">{description}</p></div><Switch defaultChecked={index < 2} id={`rule-${index}`} /></div>)}</CardContent></Card>
        </TabsContent>
        <TabsContent value="account"><Card className="max-w-2xl border-border/60 shadow-none"><CardHeader><CardTitle>Cuenta administradora</CardTitle><CardDescription>Gestiona tu sesión y preferencias de la consola.</CardDescription></CardHeader><CardContent><Link className="text-sm font-medium text-primary hover:underline" href="/users">Ver usuarios y permisos</Link></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
}
