"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { useAuth } from "@/components/providers/auth-provider";

const INSTITUTIONAL_DOMAIN = "@unicesar.edu.co";

function registerErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 409) return "Ese correo ya está registrado.";
    if (err.status === 422) {
      return (
        err.message ||
        `Usa un correo ${INSTITUTIONAL_DOMAIN} y una contraseña más segura.`
      );
    }
    return err.message || "No se pudo completar el registro.";
  }
  return "No se pudo completar el registro. Revisa tu conexión e inténtalo de nuevo.";
}

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { register, login } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.toLowerCase().endsWith(INSTITUTIONAL_DOMAIN)) {
      setError(`El registro solo admite correos ${INSTITUTIONAL_DOMAIN}.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await register({ email, full_name: fullName, password });
      await login(email, password);
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(registerErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea tu cuenta</CardTitle>
          <CardDescription>
            Regístrate con tu correo institucional
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="full_name">Nombre completo</FieldLabel>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Juan Pérez"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder={`usuario${INSTITUTIONAL_DOMAIN}`}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <FieldDescription>
                  Solo se aceptan correos {INSTITUTIONAL_DOMAIN}.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm_password">
                  Confirmar contraseña
                </FieldLabel>
                <Input
                  id="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Registrarse"}
                </Button>
                <FieldDescription className="text-center">
                  ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Al hacer clic en continuar, aceptas nuestros{" "}
        <a href="#">Términos de Servicio</a> y nuestra{" "}
        <a href="#">Política de Privacidad</a>.
      </FieldDescription>
    </div>
  );
}
