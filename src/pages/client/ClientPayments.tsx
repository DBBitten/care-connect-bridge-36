import { ClientLayout } from "@/components/client/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreditCard, XCircle, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { usePayments } from "@/contexts/PaymentContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const ClientPayments = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getAppointmentsByClient, cancelAppointment, getPaymentByAppointment } = usePayments();
  const [cancelId, setCancelId] = useState<string | null>(null);

  const appointments = user ? getAppointmentsByClient(user.email) : [];
  const sorted = [...appointments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCancel = (appointmentId: string) => {
    cancelAppointment(appointmentId);
    toast({ title: "Agendamento cancelado", description: "O reembolso será processado conforme a política de cancelamento." });
    setCancelId(null);
  };

  const getCancelInfo = (appt: typeof appointments[0]) => {
    const apptDate = new Date(`${appt.dates[0]}T${appt.startTime}:00`);
    const hoursUntil = (apptDate.getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursUntil > 24) return { text: "Reembolso integral", rate: "100%" };
    return { text: "Reembolso parcial (50%)", rate: "50%" };
  };

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive"; icon: typeof CheckCircle }> = {
    PAYMENT_PENDING: { label: "Aguardando pagamento", variant: "secondary", icon: Clock },
    PAID: { label: "Pago", variant: "default", icon: CheckCircle },
    CANCELED: { label: "Cancelado", variant: "destructive", icon: XCircle },
    COMPLETED: { label: "Concluído", variant: "default", icon: CheckCircle },
    IN_PROGRESS: { label: "Em andamento", variant: "secondary", icon: Clock },
  };

  return (
    <ClientLayout title="Pagamentos" subtitle="Acompanhe seus agendamentos e pagamentos">
      <div className="max-w-4xl space-y-6">
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <AlertTriangle className="w-4 h-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            <strong>Modo MVP</strong> — Todos os pagamentos são simulados. Nenhum valor real é cobrado.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Meus Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            {sorted.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
                <Button className="mt-4" onClick={() => navigate("/buscar-cuidadores")}>Buscar cuidadores</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sorted.map(appt => {
                  const config = statusConfig[appt.status] || statusConfig.PAYMENT_PENDING;
                  const StatusIcon = config.icon;
                  const payment = getPaymentByAppointment(appt.id);
                  const cancelInfo = getCancelInfo(appt);

                  return (
                    <div key={appt.id} className="p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4 text-muted-foreground" />
                            <p className="font-semibold text-foreground">{appt.serviceName}</p>
                            <Badge variant={config.variant}>{config.label}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {appt.caregiverName} • {appt.dates.map(d => new Date(d).toLocaleDateString("pt-BR")).join(", ")} • {appt.startTime}–{appt.endTime}
                          </p>
                          {payment && (
                            <p className="text-xs text-muted-foreground">
                              Método: {payment.method === "SIMULATED" ? "Simulado" : payment.method}
                              {payment.paidAt && ` • Pago em ${new Date(payment.paidAt).toLocaleDateString("pt-BR")}`}
                            </p>
                          )}
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-lg font-bold text-foreground">R$ {appt.totalPrice.toFixed(2)}</p>
                          {appt.status === "PAYMENT_PENDING" && (
                            <Button size="sm" onClick={() => navigate(`/checkout/${appt.id}`)}>
                              Pagar agora
                            </Button>
                          )}
                          {appt.status === "PAID" && (
                            <Dialog open={cancelId === appt.id} onOpenChange={open => { if (!open) setCancelId(null); }}>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-destructive" onClick={() => setCancelId(appt.id)}>
                                  Cancelar
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Cancelar agendamento</DialogTitle>
                                  <DialogDescription>
                                    Deseja cancelar o atendimento "{appt.serviceName}" em {appt.dates.map(d => new Date(d).toLocaleDateString("pt-BR")).join(", ")}?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="p-4 rounded-xl bg-muted/50 space-y-2">
                                  <p className="text-sm font-medium text-foreground">Política de Cancelamento:</p>
                                  <p className="text-sm text-muted-foreground">{cancelInfo.text} ({cancelInfo.rate} de R$ {appt.totalPrice.toFixed(2)})</p>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setCancelId(null)}>Voltar</Button>
                                  <Button variant="destructive" onClick={() => handleCancel(appt.id)}>Confirmar cancelamento</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientPayments;
