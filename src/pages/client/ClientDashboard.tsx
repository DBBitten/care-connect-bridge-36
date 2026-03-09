import { ClientLayout } from "@/components/client/ClientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star, Users, MapPin, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";

const upcomingAppointments = [
  {
    id: 1,
    caregiverId: "cg-1",
    caregiverName: "Maria Silva",
    date: "Hoje",
    time: "14:00 - 18:00",
    location: "Sua residência",
    type: "Cuidado diário",
    avatar: "MS",
  },
  {
    id: 2,
    caregiverId: "cg-2",
    caregiverName: "Ana Santos",
    date: "Amanhã",
    time: "08:00 - 12:00",
    location: "Sua residência",
    type: "Companhia",
    avatar: "AS",
  },
  {
    id: 3,
    caregiverId: "cg-4",
    caregiverName: "Carla Mendes",
    date: "Sex, 24 Jan",
    time: "09:00 - 17:00",
    location: "Sua residência",
    type: "Cuidado integral",
    avatar: "CM",
  },
];

const recentCaregivers = [
  { id: 1, name: "Maria Silva", rating: 4.9, specialty: "Cuidado diário", avatar: "MS" },
  { id: 2, name: "Ana Santos", rating: 4.8, specialty: "Companhia", avatar: "AS" },
];

const pendingReviews = [
  { id: 1, caregiverName: "Carla Mendes", date: "20 Jan 2025", type: "Cuidado integral" },
];

const ClientDashboard = () => {
  return (
    <ClientLayout title="Dashboard" subtitle="Bem-vindo de volta, João!">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Próximos atendimentos</p>
                <p className="text-3xl font-bold text-foreground mt-1">3</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Horas contratadas</p>
                <p className="text-3xl font-bold text-foreground mt-1">32h</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cuidadores favoritos</p>
                <p className="text-3xl font-bold text-foreground mt-1">2</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avaliações pendentes</p>
                <p className="text-3xl font-bold text-foreground mt-1">1</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <Star className="w-6 h-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-8 bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Encontre o cuidador ideal</h3>
              <p className="text-primary-foreground/80 text-sm">Busque entre nossos profissionais certificados</p>
            </div>
            <Button variant="hero-outline" asChild>
              <Link to="/buscar-cuidadores">
                <Search className="w-4 h-4 mr-2" />
                Buscar cuidadores
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Próximos Atendimentos</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/cliente/agenda">
                  Ver todos <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{appointment.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{appointment.caregiverName}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{appointment.date}</p>
                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-[120px]">{appointment.location}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Caregivers & Pending Reviews */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Cuidadores Recentes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/buscar-cuidadores">
                  Ver mais <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCaregivers.map((caregiver) => (
                <div key={caregiver.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    <span className="text-sm font-medium text-secondary-foreground">{caregiver.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{caregiver.name}</p>
                    <p className="text-xs text-muted-foreground">{caregiver.specialty}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-sm font-medium">{caregiver.rating}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Reviews */}
          {pendingReviews.length > 0 && (
            <Card variant="warm">
              <CardHeader>
                <CardTitle className="text-lg">Avaliações Pendentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl bg-muted/50">
                    <p className="font-medium text-foreground">{review.caregiverName}</p>
                    <p className="text-sm text-muted-foreground mb-3">{review.date} - {review.type}</p>
                    <Button size="sm" className="w-full" asChild>
                      <Link to={`/cliente/avaliacoes?pendente=${review.id}`}>
                        <Star className="w-4 h-4 mr-2" />
                        Avaliar atendimento
                      </Link>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
