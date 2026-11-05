"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { Search, UserPlus, Users } from "lucide-react";
import { CreateVisitorForm } from "@/components/private/guard/create-visitor-form";
import { usersService } from "@/lib/services/users.service";
import type { UserRead } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function VisitorsPage() {
  const [search, setSearch] = useState("");
  const { data, error, isLoading, mutate } = useSWR<UserRead[]>(["visitors", search], () => usersService.list({ role: "visitor", search: search || undefined }));
  const visitors = useMemo(() => data ?? [], [data]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-primary">Control de accesos</p>
        <h1 className="text-2xl font-semibold tracking-tight">Visitantes</h1>
        <p className="text-sm text-muted-foreground">Crea accesos temporales y consulta los visitantes registrados.</p>
      </div>

      <Tabs defaultValue="list" className="flex flex-col gap-6">
        <TabsList className="w-fit">
          <TabsTrigger value="list"><Users data-icon="inline-start" />Visitantes registrados</TabsTrigger>
          <TabsTrigger value="create"><UserPlus data-icon="inline-start" />Crear visitante</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-0">
          <Card>
            <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Directorio de visitantes</CardTitle>
                <CardDescription>{visitors.length} registros encontrados</CardDescription>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" placeholder="Buscar por nombre o correo" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar visitantes" />
              </div>
            </CardHeader>
            <CardContent>
              {error ? <p className="py-8 text-center text-sm text-destructive">No se pudieron cargar los visitantes.</p> : isLoading ? <p className="py-8 text-center text-sm text-muted-foreground">Cargando visitantes...</p> : (
                <div className="overflow-x-auto rounded-lg border">
                  <Table>
                    <TableHeader><TableRow><TableHead>Visitante</TableHead><TableHead>Correo</TableHead><TableHead>Vigencia</TableHead><TableHead>Estado</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {visitors.length === 0 ? <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No hay visitantes registrados.</TableCell></TableRow> : visitors.map((visitor) => {
                        const expired = visitor.access_expires_at ? new Date(visitor.access_expires_at) <= new Date() : false;
                        return <TableRow key={visitor.id}><TableCell className="font-medium">{visitor.full_name}</TableCell><TableCell>{visitor.email}</TableCell><TableCell>{visitor.access_expires_at ? new Date(visitor.access_expires_at).toLocaleString("es-MX") : "Sin límite"}</TableCell><TableCell><Badge variant={expired ? "destructive" : "secondary"}>{expired ? "Expirado" : "Activo"}</Badge></TableCell></TableRow>;
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-0">
          <Card><CardHeader><CardTitle>Nuevo visitante</CardTitle><CardDescription>El acceso se habilita de inmediato y expira en la fecha indicada.</CardDescription></CardHeader><CardContent><CreateVisitorForm onCreated={() => mutate()} /></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
