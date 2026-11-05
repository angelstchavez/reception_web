"use client";

import useSWR from "swr";
import { useState, type FormEvent } from "react";
import { BookOpen, Plus, Search } from "lucide-react";
import { catalogService } from "@/lib/services/catalog.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const resources = { terms: { path: "academic-terms", label: "Periodos académicos", fields: [["name", "Nombre"], ["starts_on", "Inicio"], ["ends_on", "Fin"]] }, classrooms: { path: "classrooms", label: "Aulas", fields: [["name", "Nombre"], ["building", "Edificio"], ["capacity", "Capacidad"]] }, subjects: { path: "subjects", label: "Asignaturas", fields: [["name", "Nombre"], ["code", "Código"]] } } as const;
type ResourceKey = keyof typeof resources;

function CatalogPanel({ resourceKey }: { resourceKey: ResourceKey }) {
  const resource = resources[resourceKey]; const { data, mutate } = useSWR(resource.path, () => catalogService.list(resource.path, { limit: 100 })); const [query, setQuery] = useState(""); const [open, setOpen] = useState(false); const [form, setForm] = useState<Record<string, string>>({});
  const rows = (data ?? []).filter((item) => JSON.stringify(item).toLowerCase().includes(query.toLowerCase()));
  async function submit(event: FormEvent) { event.preventDefault(); await catalogService.create(resource.path, { ...form, ...(form.capacity ? { capacity: Number(form.capacity) } : {}) }); setOpen(false); setForm({}); await mutate(); }
  return <Card><CardHeader><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><CardTitle>{resource.label}</CardTitle><CardDescription>Información operativa sincronizada con la API.</CardDescription></div><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/><Input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Buscar registro" className="pl-9 sm:w-56"/></div><Button onClick={()=>setOpen(!open)}><Plus data-icon="inline-start"/>Agregar</Button></div></div></CardHeader><CardContent>{open && <form onSubmit={submit} className="mb-6 grid gap-4 rounded-xl border bg-muted/30 p-4 sm:grid-cols-3">{resource.fields.map(([key,label])=><div className="grid gap-2" key={key}><Label htmlFor={`${resourceKey}-${key}`}>{label}</Label><Input id={`${resourceKey}-${key}`} required value={form[key] ?? ""} onChange={(event)=>setForm({...form,[key]:event.target.value})}/></div>)}<div className="flex items-end gap-2"><Button type="submit">Guardar</Button><Button type="button" variant="outline" onClick={()=>setOpen(false)}>Cancelar</Button></div></form>}<Table><TableHeader><TableRow><TableHead>Nombre / código</TableHead><TableHead>Detalle</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader><TableBody>{rows.map((item)=><TableRow key={item.id}><TableCell className="font-medium">{String(item.name ?? item.code ?? item.identifier ?? item.id)}</TableCell><TableCell className="text-muted-foreground">{String(item.location ?? item.building ?? item.code ?? "—")}</TableCell><TableCell><Badge variant={item.is_active ? "default" : "secondary"}>{item.is_active ? "Activo" : "Inactivo"}</Badge></TableCell></TableRow>)}{!rows.length && <TableRow><TableCell colSpan={3} className="py-10 text-center text-muted-foreground">No hay registros.</TableCell></TableRow>}</TableBody></Table></CardContent></Card>;
}
export default function CatalogsPage() { return <main className="flex flex-col gap-6"><header><div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary"><BookOpen className="size-4"/> Configuración académica</div><h1 className="text-3xl font-semibold tracking-tight">Catálogos</h1><p className="text-muted-foreground">Gestiona la estructura académica que alimenta horarios y asistencia.</p></header><Tabs defaultValue="terms"><TabsList><TabsTrigger value="terms">Periodos</TabsTrigger><TabsTrigger value="classrooms">Aulas</TabsTrigger><TabsTrigger value="subjects">Asignaturas</TabsTrigger></TabsList><TabsContent value="terms"><CatalogPanel resourceKey="terms"/></TabsContent><TabsContent value="classrooms"><CatalogPanel resourceKey="classrooms"/></TabsContent><TabsContent value="subjects"><CatalogPanel resourceKey="subjects"/></TabsContent></Tabs></main>; }
