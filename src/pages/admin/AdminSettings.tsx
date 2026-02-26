import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Settings, Info } from "lucide-react";
import { useState } from "react";
import { usePayments } from "@/contexts/PaymentContext";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { toast } = useToast();
  const { settings, updatePlatformFeeRate } = usePayments();
  const [rate, setRate] = useState(Math.round(settings.platformFeeRate * 100));

  const handleSave = () => {
    updatePlatformFeeRate(rate / 100);
    toast({ title: "Taxa atualizada", description: `Nova taxa: ${rate}%. Aplicada a novos agendamentos.` });
  };

  const hasChanged = rate !== Math.round(settings.platformFeeRate * 100);

  return (
    <AdminLayout title="Configurações da Plataforma" subtitle="Gerencie as configurações gerais">
      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Taxa da Plataforma
            </CardTitle>
            <CardDescription>
              Percentual retido pela plataforma sobre cada atendimento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">Taxa atual</span>
                <span className="text-3xl font-bold text-primary">{rate}%</span>
              </div>
              <Slider
                value={[rate]}
                onValueChange={([v]) => setRate(v)}
                min={10}
                max={30}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10%</span>
                <span>30%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/50 space-y-2">
              <p className="text-sm font-medium text-foreground">Exemplo de cálculo com taxa de {rate}%:</p>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Atendimento de R$ 100,00:</p>
                <p>• Taxa da plataforma: R$ {(100 * rate / 100).toFixed(2)}</p>
                <p>• Repasse ao cuidador: R$ {(100 - 100 * rate / 100).toFixed(2)}</p>
              </div>
            </div>

            <Button onClick={handleSave} disabled={!hasChanged} className="w-full">
              Salvar alteração
            </Button>
          </CardContent>
        </Card>

        <Alert>
          <Info className="w-4 h-4" />
          <AlertDescription>
            A taxa é aplicada apenas a novos agendamentos. Agendamentos existentes mantêm a taxa vigente no momento da criação.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações Gerais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Moeda</span>
              <span className="font-medium text-foreground">{settings.currency}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método de pagamento</span>
              <span className="font-medium text-foreground">Simulado (MVP)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Última atualização</span>
              <span className="font-medium text-foreground">{new Date(settings.updatedAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
