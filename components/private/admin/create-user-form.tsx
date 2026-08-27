"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api-client";
import { useCreateUser } from "@/hooks/use-users";
import type { Role } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

const ROLES: Array<{ value: Exclude<Role, "visitor">; label: string }> = [
  { value: "student", label: "Estudiante" },
  { value: "professor", label: "Profesor" },
  { value: "guard", label: "Guardia" },
  { value: "admin", label: "Administrador" },
];

function errorMessage(error: ApiError | null) {
  if (!error) return null;
  if (error.status === 409) return "Ese correo ya está registrado.";
  return error.message || "No se pudo crear el usuario.";
}

export function CreateUserForm() {
  const { createUser, loading, error } = useCreateUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Exclude<Role, "visitor">>("student");
  const [success, setSuccess] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(null);
    const user = await createUser({
      full_name: fullName,
      email,
      password,
      role,
    });
    if (user) {
      setSuccess(`Se creó la cuenta de ${user.full_name}.`);
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("student");
    }
  }

  return (
    <form onSubmit={submit} noValidate className="max-w-xl rounded-lg border bg-card p-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="user-full-name">Nombre completo</FieldLabel>
          <Input id="user-full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} required disabled={loading} autoComplete="name" />
        </Field>
        <Field>
          <FieldLabel htmlFor="user-email">Correo electrónico</FieldLabel>
          <Input id="user-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} autoComplete="email" />
        </Field>
        <Field>
          <FieldLabel htmlFor="user-password">Contraseña temporal</FieldLabel>
          <Input id="user-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required disabled={loading} autoComplete="new-password" />
        </Field>
        <Field>
          <FieldLabel htmlFor="user-role">Rol</FieldLabel>
          <select id="user-role" value={role} onChange={(event) => setRole(event.target.value as Exclude<Role, "visitor">)} disabled={loading} className="h-9 rounded-md border bg-background px-3 text-sm">
            {ROLES.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
        {errorMessage(error) && <p role="alert" className="text-sm text-destructive">{errorMessage(error)}</p>}
        {success && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-400">{success}</p>}
        <Button type="submit" disabled={loading}>{loading ? "Creando..." : "Crear usuario"}</Button>
      </FieldGroup>
    </form>
  );
}
