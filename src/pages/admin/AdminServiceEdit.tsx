import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useServices } from "@/contexts/ServiceContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const AdminServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getServiceById, createService, updateService } = useServices();
  const isNew = !id || id === "new";
  const existing = isNew ? undefined : getServiceById(id);

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [certTag, setCertTag] = useState(existing?.requiresCertificationTag ?? "");
  const [sortOrder, setSortOrder] = useState(existing?.sortOrder ?? 1);
  const [isActive, setIsActive] = useState(existing?.isActive ?? true);

  useEffect(() => {
    if (!isNew && !existing) navigate("/admin/services");
  }, [isNew, existing, navigate]);

  const handleSubmit = () => {
    if (!name.trim()) { toast.error("Nome é obrigatório"); return; }

    const data = {
      name: name.trim(),
      description: description.trim(),
      requiresCertificationTag: certTag || undefined,
      isActive,
      sortOrder,
    };

    if (isNew) {
      createService(data);
      toast.success("Serviço criado com sucesso!");
    } else {
      updateService(id!, data);
      toast.success("Serviço atualizado com sucesso!");
    }
    navigate("/admin/services");
  };

  return (
    <AdminLayout title={isNew ? "Novo Serviço" : "Editar Serviço"}>
      <Button variant="ghost" className="mb-6" onClick={() => navigate("/admin/services")}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
      </Button>

      <Card className="max-w-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Companhia e supervisão" />
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Descrição curta do serviço" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Certificação requerida</Label>
              <Select value={certTag} onValueChange={setCertTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Nenhuma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Nenhuma</SelectItem>
                  <SelectItem value="BASIC_MOBILITY">Mobilidade básica</SelectItem>
                  <SelectItem value="FEEDING">Alimentação</SelectItem>
                  <SelectItem value="HYGIENE">Higiene</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ordem</Label>
              <Input type="number" min={1} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={isActive} onCheckedChange={setIsActive} />
            <Label>Serviço ativo</Label>
          </div>

          <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
            💡 Preço e durações são definidos individualmente por cada cuidador no perfil dele.
          </p>

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button onClick={handleSubmit}>{isNew ? "Criar serviço" : "Salvar alterações"}</Button>
            <Button variant="outline" onClick={() => navigate("/admin/services")}>Cancelar</Button>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminServiceEdit;
