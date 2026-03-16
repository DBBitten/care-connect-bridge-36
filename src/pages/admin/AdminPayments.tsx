import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, TrendingUp, RotateCcw } from "lucide-react";
import { useState, useMemo } from "react";
import { usePayments } from "@/contexts/PaymentContext";
import { useToast } from "@/hooks/use-toast";

const AdminPayments = () => {
  const { toast } = useToast();
  const { payments, appointments, refunds, adminRefund } = usePayments();
  const [refundPaymentId, setRefundPaymentId] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");

  const appointmentMap = useMemo(() =>
    Object.fromEntries(appointments.map(a => [a.id, a])),
    [appointments]
  );

  const totalReceived = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.amountTotal, 0);
  const totalFees = payments.filter(p => p.status === "PAID").reduce((s, p) => s + p.platformFee, 0);
  const totalRefunded = refunds.reduce((s, r) => s + r.amount, 0);

  const handleRefund = () => {
    if (!refundPaymentId || !refundReason.trim()) return;
    adminRefund(refundPaymentId, refundReason.trim());
    toast({ title: "Reembolso processado", description: "O pagamento foi reembolsado com sucesso." });
    setRefundPaymentId(null);
    setRefundReason("");
  };

  

  const statusLabel: Record<string, string> = {
    PAID: "Pago", REFUNDED: "Reembolsado", INITIATED: "Iniciado", FAILED: "Falhou", CANCELED: "Cancelado",
  };
  const statusVariant = (s: string) => s === "PAID" ? "default" as const : s === "REFUNDED" ? "destructive" as const : "secondary" as const;

  return (
    <AdminLayout title="Pagamentos" subtitle="Gerencie os pagamentos da plataforma">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Recebido</p>
              <p className="text-2xl font-bold text-foreground">R$ {totalReceived.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taxa Acumulada</p>
              <p className="text-2xl font-bold text-foreground">R$ {totalFees.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Reembolsos</p>
              <p className="text-2xl font-bold text-foreground">R$ {totalRefunded.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments table */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum pagamento registrado.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Taxa</TableHead>
                  <TableHead>Payout</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map(p => {
                  const appt = appointmentMap[p.appointmentId];
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.id.slice(0, 12)}</TableCell>
                      <TableCell>{appt?.clientEmail ?? "—"}</TableCell>
                      <TableCell>{appt?.serviceName ?? "—"}</TableCell>
                      <TableCell>R$ {p.amountTotal.toFixed(2)}</TableCell>
                      <TableCell>R$ {p.platformFee.toFixed(2)}</TableCell>
                      <TableCell>R$ {p.caregiverPayout.toFixed(2)}</TableCell>
                      <TableCell><Badge variant={statusVariant(p.status)}>{statusLabel[p.status] ?? p.status}</Badge></TableCell>
                      <TableCell className="text-sm">{new Date(p.createdAt).toLocaleDateString("pt-BR")}</TableCell>
                      <TableCell>
                        {p.status === "PAID" && (
                          <Dialog open={refundPaymentId === p.id} onOpenChange={(open) => { if (!open) { setRefundPaymentId(null); setRefundReason(""); } }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => setRefundPaymentId(p.id)}>
                                Reembolsar
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reembolsar pagamento</DialogTitle>
                                <DialogDescription>
                                  Valor: R$ {p.amountTotal.toFixed(2)}. Esta ação não pode ser desfeita.
                                </DialogDescription>
                              </DialogHeader>
                              <Textarea
                                placeholder="Motivo do reembolso (obrigatório)"
                                value={refundReason}
                                onChange={e => setRefundReason(e.target.value)}
                              />
                              <DialogFooter>
                                <Button variant="outline" onClick={() => { setRefundPaymentId(null); setRefundReason(""); }}>Cancelar</Button>
                                <Button variant="destructive" onClick={handleRefund} disabled={!refundReason.trim()}>
                                  Confirmar Reembolso
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminPayments;
