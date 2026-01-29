import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Calendar, Star, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const recentUsers = [
  { id: 1, name: "João Silva", type: "necessitado", status: "active", date: "Hoje" },
  { id: 2, name: "Maria Santos", type: "cuidador", status: "pending", date: "Hoje" },
  { id: 3, name: "Ana Costa", type: "cuidador", status: "active", date: "Ontem" },
  { id: 4, name: "Pedro Lima", type: "necessitado", status: "active", date: "Ontem" },
];

const recentAppointments = [
  { id: 1, caregiver: "Maria Santos", patient: "João Silva", date: "25 Jan", status: "scheduled" },
  { id: 2, caregiver: "Ana Costa", patient: "Roberto Dias", date: "24 Jan", status: "completed" },
  { id: 3, caregiver: "Carla Mendes", patient: "Sandra Lima", date: "24 Jan", status: "completed" },
];

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard" subtitle="Visão geral da plataforma">
      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Usuários</p>
                <p className="text-3xl font-bold text-foreground mt-1">2,547</p>
                <p className="text-xs text-success mt-1">+12% este mês</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cuidadores Ativos</p>
                <p className="text-3xl font-bold text-foreground mt-1">523</p>
                <p className="text-xs text-success mt-1">+8% este mês</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Atendimentos</p>
                <p className="text-3xl font-bold text-foreground mt-1">1,284</p>
                <p className="text-xs text-success mt-1">+23% este mês</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Faturamento</p>
                <p className="text-3xl font-bold text-foreground mt-1">R$ 45k</p>
                <p className="text-xs text-success mt-1">+15% este mês</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-secondary-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Fee Card */}
      <Card className="mb-8 bg-primary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Taxa da Plataforma</h3>
              <p className="text-primary-foreground/80 text-sm">Percentual cobrado em cada transação</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-4xl font-bold">15%</p>
                <p className="text-sm text-primary-foreground/60">por transação</p>
              </div>
              <Button variant="hero-outline" size="sm">
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Usuários Recentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/usuarios">
                Ver todos <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm font-medium text-secondary-foreground">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status === "active" ? "Ativo" : "Pendente"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{user.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Atendimentos Recentes</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/atendimentos">
                Ver todos <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{apt.caregiver}</p>
                    <p className="text-sm text-muted-foreground">→ {apt.patient}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={apt.status === "completed" ? "default" : "secondary"}>
                      {apt.status === "completed" ? "Concluído" : "Agendado"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{apt.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
