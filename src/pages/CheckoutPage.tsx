import { useParams, useNavigate, Link } from "react-router-dom";
import { calcHours } from "@/utils/timeUtils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ShieldCheck, AlertTriangle, ExternalLink, CheckCircle } from "lucide-react";
import { useState } from "react";
import { usePayments } from "@/contexts/PaymentContext";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { getAppointmentById, processPayment } = usePayments();
  const [acceptedRules, setAcceptedRules] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const appointment = appointmentId ? getAppointmentById(appointmentId) : undefined;

  if (!appointment) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Agendamento não encontrado.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>Voltar ao início</Button>
        </main>
        <Footer />
      </div>
    );
  }

  if (appointment.status !== "PAYMENT_PENDING") {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 container mx-auto px-4 text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Pagamento já realizado</h1>
          <p className="text-muted-foreground mb-4">Este agendamento já foi pago.</p>
          <Button onClick={() => navigate("/cliente/pagamentos")}>Ver meus pagamentos</Button>
        </main>
        <Footer />
      </div>
    );
  }

  const handlePay = async () => {
    if (!acceptedRules) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    processPayment(appointment.id);
    toast({ title: "Pagamento confirmado!", description: "Seu atendimento foi agendado com sucesso." });
    navigate("/cliente/pagamentos");
  };

  const formattedDates = appointment.dates.map(d => 
    new Date(d).toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to={`/agendar/1`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Checkout</h1>
              <p className="text-muted-foreground">Confirme os detalhes e finalize o pagamento</p>
            </div>

            {/* Simulated payment banner */}
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-700">
                <strong>Pagamento simulado (MVP)</strong> — Nenhum valor será cobrado.
              </AlertDescription>
            </Alert>

            {/* Appointment summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Atendimento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Serviço</span>
                  <span className="font-medium text-foreground">{appointment.serviceName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cuidador</span>
                  <span className="font-medium text-foreground">{appointment.caregiverName}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Datas ({appointment.dates.length} dia{appointment.dates.length > 1 ? "s" : ""})</span>
                  <div className="mt-1 space-y-0.5">
                    {formattedDates.map((d, i) => (
                      <p key={i} className="font-medium text-foreground text-xs">{d}</p>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Horário</span>
                  <span className="font-medium text-foreground">{appointment.startTime} – {appointment.endTime} ({parseInt(appointment.endTime) - parseInt(appointment.startTime)}h)</span>
                </div>
              </CardContent>
            </Card>

            {/* Pricing breakdown */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="text-lg">Detalhamento de Valores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor do serviço ({appointment.dates.length} dia{appointment.dates.length > 1 ? "s" : ""} × {parseInt(appointment.endTime) - parseInt(appointment.startTime)}h × R$ {appointment.pricePerHour.toFixed(2)})</span>
                  <span className="text-foreground">R$ {appointment.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de serviço</span>
                  <span className="text-muted-foreground text-xs">Inclusa no valor total</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R$ {appointment.totalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Cancellation policy */}
            <Card className="border-muted">
              <CardContent className="p-4">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Política de Cancelamento
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cancelamento com mais de 24h de antecedência: reembolso integral</li>
                  <li>• Cancelamento com menos de 24h: reembolso de 50% do valor total</li>
                  <li>• Após o início do atendimento: sem reembolso</li>
                </ul>
              </CardContent>
            </Card>

            {/* Acceptance checkbox */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
              <Checkbox
                id="accept-checkout"
                checked={acceptedRules}
                onCheckedChange={(checked) => setAcceptedRules(checked as boolean)}
              />
              <Label htmlFor="accept-checkout" className="text-sm cursor-pointer">
                Confirmo que li as{' '}
                <Link to="/regras" target="_blank" className="text-primary hover:underline inline-flex items-center gap-1">
                  Regras do Marketplace <ExternalLink className="w-3 h-3" />
                </Link>
                {' '}e a Política de Cancelamento acima.
              </Label>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handlePay}
              disabled={!acceptedRules || isProcessing}
            >
              {isProcessing ? "Processando pagamento..." : `Pagar agora (simulado) — R$ ${appointment.totalPrice.toFixed(2)}`}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Este é um pagamento simulado para fins de MVP. Nenhum valor real será cobrado.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
