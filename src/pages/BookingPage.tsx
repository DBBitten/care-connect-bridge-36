import { useState, useMemo } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, CreditCard, ShieldCheck, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useLegal } from "@/contexts/LegalContext";
import { useAuth } from "@/contexts/AuthContext";
import { useServices } from "@/contexts/ServiceContext";
import { usePayments } from "@/contexts/PaymentContext";
import { useCaregivers } from "@/contexts/CaregiverContext";

function formatDuration(minutes: number) {
  return minutes >= 60 ? `${minutes / 60}h` : `${minutes}min`;
}

const BookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { hasAccepted, acceptDocument } = useLegal();
  const { getActiveServices, getServiceById } = useServices();
  const { createAppointment } = usePayments();
  const { getProfileById } = useCaregivers();

  const caregiverProfile = getProfileById(id || "");
  const caregiverName = caregiverProfile
    ? `${caregiverProfile.firstName} ${caregiverProfile.lastInitial}.`
    : "Cuidador";

  const serviceIdParam = searchParams.get("serviceId");

  // Only show services the caregiver offers
  const availableServices = useMemo(() => {
    if (!caregiverProfile) return [];
    return caregiverProfile.serviceOffers
      .map(offer => {
        const svc = getServiceById(offer.serviceId);
        return svc ? { service: svc, offer } : null;
      })
      .filter(Boolean) as { service: NonNullable<ReturnType<typeof getServiceById>>; offer: typeof caregiverProfile.serviceOffers[0] }[];
  }, [caregiverProfile, getServiceById]);

  const [selectedServiceId, setSelectedServiceId] = useState(serviceIdParam || "");
  const selectedEntry = availableServices.find(e => e.service.id === selectedServiceId);
  const effectiveRate = selectedEntry?.offer.pricePerHour ?? 0;

  const durationOptions = selectedEntry
    ? selectedEntry.offer.availableDurations.map(m => ({ value: String(m / 60), label: formatDuration(m) }))
    : [];

  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedRules, setAcceptedRules] = useState(hasAccepted('MARKETPLACE_RULES'));

  const totalValue = duration ? parseFloat(duration) * effectiveRate : 0;

  const handleBooking = () => {
    if (!date || !startTime || !duration || !selectedEntry) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    if (!acceptedRules) {
      toast.error("Você precisa aceitar as Regras do Marketplace");
      return;
    }

    if (!hasAccepted('MARKETPLACE_RULES')) {
      acceptDocument('MARKETPLACE_RULES');
    }

    setIsLoading(true);
    const appt = createAppointment({
      clientEmail: user?.email || "guest@cuidare.com.br",
      caregiverName,
      serviceId: selectedEntry.service.id,
      serviceName: selectedEntry.service.name,
      date: date.toISOString().split("T")[0],
      startTime,
      durationHours: parseFloat(duration),
      pricePerHour: effectiveRate,
      address: "Rua das Flores, 123 — Pinheiros, São Paulo/SP",
    });
    toast.success("Agendamento criado! Finalize o pagamento.");
    navigate(`/checkout/${appt.id}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to={`/cuidador/${id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao perfil
          </Link>

          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Agendar atendimento
              </h1>
              <p className="text-muted-foreground">
                com {caregiverName}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Calendar & Time Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Data e Horário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Service selector */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Serviço
                    </label>
                    <Select value={selectedServiceId} onValueChange={(val) => { setSelectedServiceId(val); setDuration(""); }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableServices.map(({ service, offer }) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name} — R$ {offer.pricePerHour}/h
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Selecione a data
                    </label>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-xl border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Horário de início
                    </label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {["06:00","07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Duração
                    </label>
                    <Select value={duration} onValueChange={setDuration} disabled={durationOptions.length === 0}>
                      <SelectTrigger>
                        <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                        <SelectValue placeholder={durationOptions.length === 0 ? "Selecione um serviço primeiro" : "Selecione a duração"} />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Summary & Payment */}
              <div className="space-y-6">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Resumo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Cuidador</span>
                      <span className="font-medium text-foreground">{caregiverName}</span>
                    </div>

                    {selectedEntry && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Serviço</span>
                        <span className="font-medium text-foreground">{selectedEntry.service.name}</span>
                      </div>
                    )}
                    
                    {date && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Data</span>
                        <span className="font-medium text-foreground">
                          {date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
                        </span>
                      </div>
                    )}
                    
                    {startTime && duration && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Horário</span>
                        <span className="font-medium text-foreground">
                          {startTime} - {parseInt(startTime) + parseFloat(duration)}:00 ({duration}h)
                        </span>
                      </div>
                    )}

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Valor por hora</span>
                        <span className="text-foreground">R$ {effectiveRate}</span>
                      </div>
                      {duration && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Duração</span>
                          <span className="text-foreground">{duration} horas</span>
                        </div>
                      )}
                      <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                        <span>Total</span>
                        <span className="text-primary">R$ {totalValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust badges */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <ShieldCheck className="w-5 h-5 text-success" />
                    <span className="text-sm text-foreground">Pagamento 100% seguro</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <CreditCard className="w-5 h-5 text-primary" />
                    <span className="text-sm text-foreground">Cartão de crédito ou PIX</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="text-sm text-foreground">Confirmação automática</span>
                  </div>
                </div>

                {/* Marketplace Rules Acceptance */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-foreground mb-3">Regras do Atendimento</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                      <li>• Cancelamentos com menos de 24h podem ter cobrança</li>
                      <li>• Pagamentos são processados pela plataforma</li>
                      <li>• Não é permitido negociar fora da Cuidare</li>
                    </ul>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="accept-rules"
                        checked={acceptedRules}
                        onCheckedChange={(checked) => setAcceptedRules(checked as boolean)}
                      />
                      <Label htmlFor="accept-rules" className="text-sm cursor-pointer">
                        Li e aceito as{' '}
                        <Link
                          to="/regras"
                          target="_blank"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Regras do Marketplace
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  disabled={!date || !startTime || !duration || !acceptedRules || isLoading}
                >
                  {isLoading ? "Processando..." : `Confirmar e pagar R$ ${totalValue.toFixed(2)}`}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Ao confirmar, você concorda com nossos termos de serviço.
                  O atendimento será confirmado automaticamente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingPage;
