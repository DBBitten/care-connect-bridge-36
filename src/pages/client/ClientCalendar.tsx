import { ClientLayout } from "@/components/client/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, MapPin, User, Phone, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// TODO: substituir por dados reais de usePayments() e useAuth() quando houver integração com backend
const appointments = [
  {
    id: 1,
    caregiverName: "Maria Silva",
    caregiverPhone: "(11) 99999-1234",
    dates: [new Date(2025, 0, 30), new Date(2025, 0, 31)],
    time: "14:00 - 18:00",
    location: "Sua residência",
    type: "Cuidado diário",
    status: "confirmed",
    avatar: "MS",
  },
  {
    id: 2,
    caregiverName: "Ana Santos",
    caregiverPhone: "(11) 98888-5678",
    dates: [new Date(2025, 0, 31)],
    time: "08:00 - 12:00",
    location: "Sua residência",
    type: "Companhia",
    status: "confirmed",
    avatar: "AS",
  },
  {
    id: 3,
    caregiverName: "Carla Mendes",
    caregiverPhone: "(11) 97777-9012",
    dates: [new Date(2025, 1, 3), new Date(2025, 1, 4), new Date(2025, 1, 5)],
    time: "09:00 - 17:00",
    location: "Sua residência",
    type: "Cuidado integral",
    status: "pending",
    avatar: "CM",
  },
];

const ClientCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const appointmentDates = appointments.flatMap(a => a.dates.map(d => d.toDateString()));

  const filteredAppointments = selectedDate
    ? appointments.filter(a => a.dates.some(d => d.toDateString() === selectedDate.toDateString()))
    : appointments;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <ClientLayout title="Meus Agendamentos" subtitle="Visualize sua agenda de atendimentos">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              Calendário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md"
              modifiers={{
                hasAppointment: (date) => appointmentDates.includes(date.toDateString()),
              }}
              modifiersStyles={{
                hasAppointment: {
                  backgroundColor: 'hsl(var(--primary) / 0.1)',
                  fontWeight: 'bold',
                },
              }}
            />
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-primary/20"></div>
              <span>Dias com agendamento</span>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedDate ? (
                  <>Agendamentos - {formatDate(selectedDate)}</>
                ) : (
                  "Todos os Agendamentos"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-primary">{appointment.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{appointment.caregiverName}</h3>
                          <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                            {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                          </Badge>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{appointment.dates.map(d => d.toLocaleDateString('pt-BR')).join(", ")}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{appointment.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{appointment.type}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                          {/* TODO: implementar funcionalidade */}
                          <Button variant="outline" size="sm" onClick={() => {}}>
                            <Phone className="w-4 h-4 mr-1" />
                            Ligar
                          </Button>
                          {/* TODO: implementar funcionalidade */}
                          <Button variant="outline" size="sm" onClick={() => {}}>
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Mensagem
                          </Button>
                          {/* TODO: implementar funcionalidade */}
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => {}}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {selectedDate 
                      ? "Nenhum agendamento para esta data" 
                      : "Nenhum agendamento encontrado"
                    }
                  </p>
                  <Button className="mt-4" asChild>
                    <a href="/buscar-cuidadores">Buscar cuidadores</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientCalendar;
