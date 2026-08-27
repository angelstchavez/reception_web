"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api-client";
import { useCreateVisitor } from "@/hooks/use-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";

function errorMessage(error: ApiError | null) {
  if (!error) return null;
  if (error.status === 409) return "Ese correo ya está registrado.";
  return error.message || "No se pudo crear el visitante.";
}

export function CreateVisitorForm() {
  const { createVisitor, loading, error } = useCreateVisitor();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setClientError(null);
    setSuccess(null);
    const expiry = new Date(expiresAt);
    if (Number.isNaN(expiry.valueOf()) || expiry <= new Date()) {
      setClientError("La fecha de vencimiento debe estar en el futuro.");
      return;
    }
    const visitor = await createVisitor({
      full_name: fullName,
      email,
      password,
      access_expires_at: expiry.toISOString(),
    });
    if (visitor) {
      setSuccess(`Se creó el acceso temporal de ${visitor.full_name}.`);
      setFullName("");
      setEmail("");
      setPassword("");
      setExpiresAt("");
    }
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-xl rounded-lg border bg-card p-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="visitor-full-name">Nombre completo</FieldLabel>
          <Input id="visitor-full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required disabled={loading} autoComplete="name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="visitor-email">Correo electrónico</FieldLabel>
          <Input id="visitor-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} autoComplete="email" />
        </Field>
        <Field>
          <FieldLabel htmlFor="visitor-password">Contraseña temporal</FieldLabel>
          <Input id="visitor-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={loading} autoComplete="new-password" />
        </Field>
        <Field>
          <FieldLabel htmlFor="visitor-expires-at">Válido hasta</FieldLabel>
          <Input id="visitor-expires-at" type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} required disabled={loading} />
          <FieldDescription>Después de esta fecha el visitante no podrá iniciar sesión.</FieldDescription>
        </Field>
        {(clientError || errorMessage(error)) && <p role="alert" className="text-sm text-destructive">{clientError || errorMessage(error)}</p>}
        {success && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>}
        <Button type="submit" disabled={loading}>{loading ? "Creando..." : "Crear visitante"}</Button>
      </FieldGroup>
    </form>
  );
}
