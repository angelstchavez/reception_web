import { CreateUserForm } from "@/components/private/admin/create-user-form";

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Crear usuario</h1>
        <p className="text-sm text-muted-foreground">Asigna un rol institucional a una nueva cuenta.</p>
      </div>
      <CreateUserForm />
    </div>
  );
}
