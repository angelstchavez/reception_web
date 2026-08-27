import { CreateVisitorForm } from "@/components/private/guard/create-visitor-form";

export default function VisitorsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold">Registrar visitante</h1>
        <p className="text-sm text-muted-foreground">Crea una cuenta temporal para un visitante externo.</p>
      </div>
      <CreateVisitorForm />
    </div>
  );
}
