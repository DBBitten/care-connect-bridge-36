import { AdminLayout } from "@/components/admin/AdminLayout";
import { useServices } from "@/contexts/ServiceContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Plus, Pencil } from "lucide-react";

const AdminServices = () => {
  const { services, toggleActive } = useServices();
  const sorted = [...services].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <AdminLayout title="Serviços" subtitle="Gerencie o catálogo de serviços da plataforma">
      <div className="flex justify-end mb-6">
        <Button asChild>
          <Link to="/admin/services/new">
            <Plus className="w-4 h-4 mr-2" /> Criar serviço
          </Link>
        </Button>
      </div>

      <div className="bg-background rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Ordem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-28">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((svc) => (
              <TableRow key={svc.id}>
                <TableCell className="font-mono text-sm">{svc.sortOrder}</TableCell>
                <TableCell className="font-medium">{svc.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{svc.description}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={svc.isActive} onCheckedChange={() => toggleActive(svc.id)} />
                    <span className="text-xs text-muted-foreground">{svc.isActive ? "Ativo" : "Inativo"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/services/${svc.id}`}>
                      <Pencil className="w-4 h-4 mr-1" /> Editar
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
