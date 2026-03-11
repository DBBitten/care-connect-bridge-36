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

function calcHours(start: string, end: string) {
  return parseInt(end) - parseInt(start);
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

  const [dates, setDates] = useState<Date[] | undefined>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [acceptedRules, setAcceptedRules] = useState(hasAccepted('MARKETPLACE_RULES'));

  const numDays = dates?.length || 0;
  const hours = (startTime && endTime) ? calcHours(startTime, endTime) : 0;
  const totalValue = numDays * hours * effectiveRate;

  const endTimeOptions = startTime
    ? ["07:00","08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00","22:00"].filter(t => parseInt(t) > parseInt(startTime))
    : [];

  const handleBooking = () => {
    if (!dates || dates.length === 0 || !startTime || !endTime || !selectedEntry) {
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
      dates: dates.map(d => d.toISOString().split("T")[0]).sort(),
      startTime,
      endTime,
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
                    <Select value={selectedServiceId} onValueChange={(val) => { setSelectedServiceId(val); setEndTime(""); }}>
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
                      Selecione os dias <span className="text-muted-foreground font-normal">(múltiplos)</span>
                    </label>
                    <Calendar
                      mode="multiple"
                      selected={dates}
                      onSelect={setDates}
                      disabled={(date) => date < new Date() || date.getDay() === 0}
                      className="rounded-xl border"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Horário de início
                    </label>
                    <Select value={startTime} onValueChange={(val) => { setStartTime(val); setEndTime(""); }}>
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
                      Horário de término
                    </label>
                    <Select value={endTime} onValueChange={setEndTime} disabled={!startTime}>
                      <SelectTrigger>
                        <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                        <SelectValue placeholder={!startTime ? "Selecione o horário de início primeiro" : "Selecione o horário"} />
                      </SelectTrigger>
                      <SelectContent>
                        {endTimeOptions.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
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
                    
                    {dates && dates.length > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Datas selecionadas ({dates.length} dia{dates.length > 1 ? "s" : ""})</span>
                        <div className="mt-1 space-y-1">
                          {dates
                            .sort((a, b) => a.getTime() - b.getTime())
                            .map((d, i) => (
                              <p key={i} className="font-medium text-foreground text-xs">
                                {d.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" })}
                              </p>
                            ))}
                        </div>
                      </div>
                    )}
                    
                    {startTime && endTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Horário</span>
                        <span className="font-medium text-foreground">
                          {startTime} – {endTime} ({hours}h)
                        </span>
                      </div>
                    )}

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Valor por hora</span>
                        <span className="text-foreground">R$ {effectiveRate}</span>
                      </div>
                      {hours > 0 && numDays > 0 && (
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Cálculo</span>
                          <span className="text-foreground">{numDays} dia{numDays > 1 ? "s" : ""} × {hours}h × R$ {effectiveRate}</span>
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
                      <li>• Não é permitido negociar fora da Curami</li>
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
                  disabled={!dates || dates.length === 0 || !startTime || !endTime || !acceptedRules || isLoading}
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
