import { ClientLayout } from "@/components/client/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Plus, Trash2, CheckCircle, Building2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const paymentMethods = [
  {
    id: 1,
    type: "credit",
    brand: "Visa",
    lastDigits: "4532",
    expiry: "12/26",
    isDefault: true,
  },
  {
    id: 2,
    type: "credit",
    brand: "Mastercard",
    lastDigits: "8791",
    expiry: "08/25",
    isDefault: false,
  },
];

const recentTransactions = [
  {
    id: 1,
    description: "Atendimento - Maria Silva",
    date: "22 Jan 2025",
    amount: "R$ 280,00",
    status: "completed",
  },
  {
    id: 2,
    description: "Atendimento - Ana Santos",
    date: "18 Jan 2025",
    amount: "R$ 200,00",
    status: "completed",
  },
  {
    id: 3,
    description: "Atendimento - Carla Mendes",
    date: "15 Jan 2025",
    amount: "R$ 480,00",
    status: "completed",
  },
  {
    id: 4,
    description: "Atendimento agendado - Maria Silva",
    date: "25 Jan 2025",
    amount: "R$ 280,00",
    status: "pending",
  },
];

const ClientPayments = () => {
  const { toast } = useToast();
  const [methods, setMethods] = useState(paymentMethods);

  const handleSetDefault = (id: number) => {
    setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })));
    toast({
      title: "Cartão padrão atualizado",
      description: "Este cartão será usado para pagamentos futuros.",
    });
  };

  const handleRemove = (id: number) => {
    setMethods(methods.filter(m => m.id !== id));
    toast({
      title: "Cartão removido",
      description: "O cartão foi removido com sucesso.",
    });
  };

  return (
    <ClientLayout title="Pagamentos" subtitle="Gerencie suas formas de pagamento">
      <div className="max-w-4xl space-y-6">
        {/* Payment Methods */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Formas de Pagamento</CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar cartão
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {methods.map((method) => (
              <div
                key={method.id}
                className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-foreground">{method.brand} •••• {method.lastDigits}</p>
                    {method.isDefault && (
                      <Badge variant="default" className="text-xs">Padrão</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Expira em {method.expiry}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Definir padrão
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(method.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {methods.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma forma de pagamento cadastrada</p>
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar cartão
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Endereço de Cobrança</CardTitle>
            <Button variant="outline" size="sm">Editar</Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Building2 className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">João Oliveira</p>
                <p className="text-sm text-muted-foreground">Rua das Flores, 123</p>
                <p className="text-sm text-muted-foreground">Pinheiros - São Paulo, SP</p>
                <p className="text-sm text-muted-foreground">CEP: 05420-010</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-muted/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{transaction.amount}</p>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status === "completed" ? "Pago" : "Pendente"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientPayments;
