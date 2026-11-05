"use client";

import useSWR from "swr";
import { useMemo, useState } from "react";
import { CarFront, MoreHorizontal, Plus, Search } from "lucide-react";
import { resourcesService } from "@/lib/services/resources.service";
import { ApiError } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VehiclesPage() {
  const { data, error, mutate } = useSWR("vehicles", () => resourcesService.listVehicles({ limit: 100 }));
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ plate: "", vehicle_type: "car", brand: "", model: "", color: "", photo_key: "" });
  const vehicles = useMemo(() => (data ?? []).filter((vehicle) => `${vehicle.plate} ${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(query.toLowerCase())), [data, query]);
  async function createVehicle(event: React.FormEvent) {
    event.preventDefault();
    await resourcesService.createVehicle({ ...form, vehicle_type: form.vehicle_type as "car" | "motorcycle" | "bicycle" | "other" });
    setForm({ plate: "", vehicle_type: "car", brand: "", model: "", color: "", photo_key: "" });
    setOpen(false);
    await mutate();
  }
  const active = (data ?? []).filter((vehicle) => vehicle.is_active).length;
  return <main className="flex flex-col gap-6">
    <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-primary"><CarFront className="size-4" /> Movilidad</div><h1 className="text-3xl font-semibold tracking-tight">Vehículos</h1><p className="text-muted-foreground">Registra y administra los vehículos autorizados para el campus.</p></div><Dialog open={open} onOpenChange={setOpen}><Button type="button" onClick={() => setOpen(true)}><Plus data-icon="inline-start" />Registrar vehículo</Button><DialogContent><DialogHeader><DialogTitle>Registrar vehículo</DialogTitle></DialogHeader><form onSubmit={createVehicle} className="flex flex-col gap-4"><div className="grid gap-4 sm:grid-cols-2">{[["plate","Placa"],["brand","Marca"],["model","Modelo"],["color","Color"]].map(([key,label])=><div className="grid gap-2" key={key}><Label htmlFor={key}>{label}</Label><Input id={key} required value={form[key as keyof typeof form]} onChange={(e)=>setForm({...form,[key]:e.target.value})}/></div>)}</div><div className="grid gap-2"><Label>Tipo</Label><Select value={form.vehicle_type} onValueChange={(value)=>setForm({...form,vehicle_type:value ?? "car"})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="car">Automóvil</SelectItem><SelectItem value="motorcycle">Motocicleta</SelectItem><SelectItem value="bicycle">Bicicleta</SelectItem><SelectItem value="other">Otro</SelectItem></SelectContent></Select></div><div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={()=>setOpen(false)}>Cancelar</Button><Button type="submit">Guardar vehículo</Button></div></form></DialogContent></Dialog></header>
    <div className="grid gap-3 sm:grid-cols-3"><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Registrados</p><p className="mt-1 text-2xl font-semibold">{data?.length ?? "—"}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Activos</p><p className="mt-1 text-2xl font-semibold text-primary">{data ? active : "—"}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Inactivos</p><p className="mt-1 text-2xl font-semibold">{data ? data.length - active : "—"}</p></CardContent></Card></div>
    <Card><CardHeader><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><div><CardTitle>Vehículos autorizados</CardTitle><CardDescription>Datos sincronizados con la API de vehículos.</CardDescription></div><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground"/><Input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Buscar placa, marca o modelo" className="pl-9 md:w-72"/></div></div></CardHeader><CardContent>{error ? <p className="text-sm text-destructive">{error instanceof ApiError ? error.message : "No se pudieron cargar los vehículos."}</p> : <Table><TableHeader><TableRow><TableHead>Placa</TableHead><TableHead>Vehículo</TableHead><TableHead>Color</TableHead><TableHead>Estado</TableHead><TableHead className="w-10" /></TableRow></TableHeader><TableBody>{vehicles.map((vehicle)=><TableRow key={vehicle.id}><TableCell className="font-mono font-medium">{vehicle.plate}</TableCell><TableCell><div className="font-medium">{vehicle.brand} {vehicle.model}</div><div className="text-xs text-muted-foreground">{vehicle.vehicle_type}</div></TableCell><TableCell>{vehicle.color}</TableCell><TableCell><Badge variant={vehicle.is_active ? "default" : "secondary"}>{vehicle.is_active ? "Activo" : "Inactivo"}</Badge></TableCell><TableCell><Button variant="ghost" size="icon" aria-label={`Opciones para ${vehicle.plate}`}><MoreHorizontal /></Button></TableCell></TableRow>)}{!vehicles.length && <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No hay vehículos que coincidan con la búsqueda.</TableCell></TableRow>}</TableBody></Table>}</CardContent></Card>
  </main>;
}
