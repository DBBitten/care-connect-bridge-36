import { CaregiverLayout } from "@/components/caregiver/CaregiverLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Clock, CheckCircle, Play, Lock, Award } from "lucide-react";

const courses = [
  {
    id: 1,
    name: "Introdução ao Cuidado de Idosos",
    description: "Fundamentos essenciais para o cuidado de pessoas idosas",
    duration: "2 horas",
    status: "completed",
    progress: 100,
    unlocks: ["Cuidado básico de idosos"],
  },
  {
    id: 2,
    name: "Cuidados Básicos de Saúde",
    description: "Primeiros socorros, sinais vitais e emergências",
    duration: "3 horas",
    status: "completed",
    progress: 100,
    unlocks: ["Cuidado de saúde"],
  },
  {
    id: 3,
    name: "Mobilidade e Transferências",
    description: "Técnicas seguras para auxiliar movimentação",
    duration: "2.5 horas",
    status: "in_progress",
    progress: 60,
    unlocks: ["Cuidado de mobilidade reduzida"],
  },
  {
    id: 4,
    name: "Alimentação e Nutrição",
    description: "Preparo de refeições e cuidados nutricionais",
    duration: "2 horas",
    status: "not_started",
    progress: 0,
    unlocks: ["Preparo de refeições especiais"],
  },
  {
    id: 5,
    name: "Cuidados com Alzheimer",
    description: "Abordagem especializada para demências",
    duration: "4 horas",
    status: "locked",
    progress: 0,
    unlocks: ["Cuidado de pacientes com demência"],
    prerequisite: "Introdução ao Cuidado de Idosos",
  },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return {
        label: "Concluído",
        color: "bg-success/10 text-success",
        icon: CheckCircle,
      };
    case "in_progress":
      return {
        label: "Em andamento",
        color: "bg-primary/10 text-primary",
        icon: Play,
      };
    case "not_started":
      return {
        label: "Não iniciado",
        color: "bg-muted text-muted-foreground",
        icon: Clock,
      };
    case "locked":
      return {
        label: "Bloqueado",
        color: "bg-muted text-muted-foreground",
        icon: Lock,
      };
    default:
      return {
        label: "Desconhecido",
        color: "bg-muted text-muted-foreground",
        icon: Clock,
      };
  }
};

const CaregiverTraining = () => {
  const completedCount = courses.filter((c) => c.status === "completed").length;

  return (
    <CaregiverLayout
      title="Formação & Certificação"
      subtitle="Complete cursos para habilitar novos tipos de atendimento"
    >
      {/* Progress Overview */}
      <Card className="mb-8" variant="warm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Seu Progresso</h3>
                <p className="text-muted-foreground">
                  {completedCount} de {courses.length} cursos concluídos
                </p>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progresso geral</span>
                <span className="text-foreground font-medium">{Math.round((completedCount / courses.length) * 100)}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / courses.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const statusConfig = getStatusConfig(course.status);
          const StatusIcon = statusConfig.icon;
          const isLocked = course.status === "locked";

          return (
            <Card key={course.id} variant="elevated" className={isLocked ? "opacity-60" : ""}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <Badge className={statusConfig.color}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {statusConfig.label}
                  </Badge>
                </div>
                <CardTitle className="mt-4">{course.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{course.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>

                {/* Progress bar for in-progress courses */}
                {course.status === "in_progress" && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="text-foreground font-medium">{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Unlocks */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Desbloqueia:</p>
                  <div className="flex flex-wrap gap-2">
                    {course.unlocks.map((unlock, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {unlock}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Prerequisite warning */}
                {course.prerequisite && (
                  <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Requer: {course.prerequisite}
                  </p>
                )}

                {/* Action button */}
                <Button
                  className="w-full"
                  variant={course.status === "completed" ? "secondary" : "default"}
                  disabled={isLocked}
                >
                  {course.status === "completed" && (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Ver certificado
                    </>
                  )}
                  {course.status === "in_progress" && (
                    <>
                      <Play className="w-4 h-4" />
                      Continuar curso
                    </>
                  )}
                  {course.status === "not_started" && (
                    <>
                      <Play className="w-4 h-4" />
                      Iniciar curso
                    </>
                  )}
                  {course.status === "locked" && (
                    <>
                      <Lock className="w-4 h-4" />
                      Bloqueado
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </CaregiverLayout>
  );
};

export default CaregiverTraining;
