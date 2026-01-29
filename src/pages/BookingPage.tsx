import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Clock, CreditCard, ShieldCheck, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Mock caregiver data
const caregiver = {
  id: 1,
  name: "Maria Santos",
  hourlyRate: 45,
};

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const totalValue = duration ? parseInt(duration) * caregiver.hourlyRate : 0;

  const handleBooking = async () => {
    if (!date || !startTime || !duration) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    setIsLoading(true);
    
    // Simulate booking
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    toast.success("Agendamento confirmado com sucesso!");
    navigate("/meus-agendamentos");
    
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
                com {caregiver.name}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Calendar & Time Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Data e Horário</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        <SelectItem value="06:00">06:00</SelectItem>
                        <SelectItem value="07:00">07:00</SelectItem>
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="11:00">11:00</SelectItem>
                        <SelectItem value="12:00">12:00</SelectItem>
                        <SelectItem value="13:00">13:00</SelectItem>
                        <SelectItem value="14:00">14:00</SelectItem>
                        <SelectItem value="15:00">15:00</SelectItem>
                        <SelectItem value="16:00">16:00</SelectItem>
                        <SelectItem value="17:00">17:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Duração
                    </label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger>
                        <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                        <SelectValue placeholder="Selecione a duração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 horas</SelectItem>
                        <SelectItem value="4">4 horas</SelectItem>
                        <SelectItem value="6">6 horas</SelectItem>
                        <SelectItem value="8">8 horas</SelectItem>
                        <SelectItem value="12">12 horas</SelectItem>
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
                      <span className="font-medium text-foreground">{caregiver.name}</span>
                    </div>
                    
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
                          {startTime} - {parseInt(startTime) + parseInt(duration)}:00 ({duration}h)
                        </span>
                      </div>
                    )}

                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Valor por hora</span>
                        <span className="text-foreground">R$ {caregiver.hourlyRate}</span>
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

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBooking}
                  disabled={!date || !startTime || !duration || isLoading}
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
