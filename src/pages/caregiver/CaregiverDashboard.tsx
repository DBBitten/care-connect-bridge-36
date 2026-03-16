import { CaregiverLayout } from "@/components/caregiver/CaregiverLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Star, DollarSign, GraduationCap, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// TODO: substituir por dados reais de usePayments() quando houver integração com backend
const upcomingAppointments = [
  {
    id: 1,
    patientName: "João Oliveira",
    date: "Hoje",
    time: "14:00 - 18:00",
    location: "Pinheiros, São Paulo",
    type: "Cuidado diário",
  },
  {
    id: 2,
    patientName: "Ana Costa",
    date: "Amanhã",
    time: "08:00 - 12:00",
    location: "Vila Madalena, São Paulo",
    type: "Companhia",
  },
  {
    id: 3,
    patientName: "Roberto Santos",
    date: "Sex, 24 Jan",
    time: "09:00 - 17:00",
    location: "Moema, São Paulo",
    type: "Cuidado integral",
  },
];

// TODO: substituir por dados reais de useCaregivers() quando houver integração com backend
const pendingCourses = [
  { id: 1, name: "Primeiros Socorros", progress: 60 },
  { id: 2, name: "Cuidados com Mobilidade", progress: 0 },
];

const CaregiverDashboard = () => {
  return (
    <CaregiverLayout title="Dashboard" subtitle="Bem-vinda de volta, Maria!">
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
                <p className="text-sm text-muted-foreground">Horas este mês</p>
                <p className="text-3xl font-bold text-foreground mt-1">48h</p>
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
                <p className="text-sm text-muted-foreground">Avaliação média</p>
                <p className="text-3xl font-bold text-foreground mt-1">4.9</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Star className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ganhos estimados</p>
                <p className="text-3xl font-bold text-foreground mt-1">R$ 2.400</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Próximos Atendimentos</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/cuidador/agenda">
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
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{appointment.patientName}</p>
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

        {/* Pending Courses */}
        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Cursos Pendentes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/cuidador/formacao">
                  Ver todos <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingCourses.map((course) => (
                <div key={course.id} className="p-4 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{course.name}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="text-foreground font-medium">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button className="w-full" variant="outline" asChild>
                <Link to="/cuidador/formacao">
                  <GraduationCap className="w-4 h-4" />
                  Continuar formação
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Certification Status */}
          <Card className="mt-6" variant="warm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Status de Certificação</p>
                  <p className="text-sm text-muted-foreground">2 de 4 cursos completos</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete mais cursos para desbloquear novos tipos de atendimento e aumentar suas oportunidades.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CaregiverLayout>
  );
};

export default CaregiverDashboard;
