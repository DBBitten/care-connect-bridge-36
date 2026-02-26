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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const DURATION_OPTIONS = [
  { value: 60, label: "1h" },
  { value: 120, label: "2h" },
  { value: 240, label: "4h" },
  { value: 360, label: "6h" },
  { value: 480, label: "8h" },
  { value: 720, label: "12h" },
];

const AdminServiceEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getServiceById, createService, updateService } = useServices();
  const isNew = !id || id === "new";
  const existing = isNew ? undefined : getServiceById(id);

  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [pricePerHour, setPricePerHour] = useState(existing?.pricePerHour ?? 0);
  const [baseDurationMinutes, setBaseDurationMinutes] = useState(existing?.baseDurationMinutes ?? 120);
  const [allowedDurations, setAllowedDurations] = useState<number[]>(existing?.allowedDurationsMinutes ?? [120]);
  const [minHours, setMinHours] = useState(existing?.minHours ?? 2);
  const [maxHours, setMaxHours] = useState(existing?.maxHours ?? 12);
  const [certTag, setCertTag] = useState(existing?.requiresCertificationTag ?? "");
  const [sortOrder, setSortOrder] = useState(existing?.sortOrder ?? 1);
  const [isActive, setIsActive] = useState(existing?.isActive ?? true);

  useEffect(() => {
    if (!isNew && !existing) navigate("/admin/services");
  }, [isNew, existing, navigate]);

  const toggleDuration = (val: number) => {
    setAllowedDurations((prev) =>
      prev.includes(val) ? prev.filter((d) => d !== val) : [...prev, val].sort((a, b) => a - b)
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) { toast.error("Nome é obrigatório"); return; }
    if (pricePerHour <= 0) { toast.error("Preço deve ser maior que zero"); return; }
    if (allowedDurations.length === 0) { toast.error("Selecione ao menos uma duração"); return; }

    const data = {
      name: name.trim(),
      description: description.trim(),
      baseDurationMinutes,
      allowedDurationsMinutes: allowedDurations,
      pricePerHour,
      minHours,
      maxHours,
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
              <Label>Preço por hora (R$) *</Label>
              <Input type="number" min={1} value={pricePerHour || ""} onChange={(e) => setPricePerHour(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Duração base (min)</Label>
              <Input type="number" min={30} value={baseDurationMinutes} onChange={(e) => setBaseDurationMinutes(Number(e.target.value))} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Durações permitidas *</Label>
            <div className="flex flex-wrap gap-4">
              {DURATION_OPTIONS.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`dur-${opt.value}`}
                    checked={allowedDurations.includes(opt.value)}
                    onCheckedChange={() => toggleDuration(opt.value)}
                  />
                  <Label htmlFor={`dur-${opt.value}`} className="cursor-pointer text-sm">{opt.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Horas mínimas</Label>
              <Input type="number" min={1} value={minHours} onChange={(e) => setMinHours(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label>Horas máximas</Label>
              <Input type="number" min={1} value={maxHours} onChange={(e) => setMaxHours(Number(e.target.value))} />
            </div>
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
