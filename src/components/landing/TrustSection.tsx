import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, ShieldCheck, CreditCard, Star, Clock, HeartHandshake } from "lucide-react";

const trustFeatures = [
  {
    icon: GraduationCap,
    title: "Formação Certificada",
    description: "Todos os cuidadores passam por cursos e são certificados antes de atender.",
  },
  {
    icon: ShieldCheck,
    title: "Verificação Completa",
    description: "Checamos documentos e referências para sua segurança e tranquilidade.",
  },
  {
    icon: CreditCard,
    title: "Pagamento Seguro",
    description: "Pague pela plataforma com total segurança. Seu dinheiro está protegido.",
  },
  {
    icon: Star,
    title: "Avaliações Reais",
    description: "Veja opiniões de outras famílias. Transparência em cada perfil.",
  },
  {
    icon: Clock,
    title: "Flexibilidade",
    description: "Agende conforme sua necessidade: diário, semanal ou pontual.",
  },
  {
    icon: HeartHandshake,
    title: "Suporte Dedicado",
    description: "Nossa equipe está aqui para ajudar em qualquer momento.",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 trust-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Por que confiar no ElderCare
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Construímos uma plataforma pensando na segurança e bem-estar de quem você mais ama.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustFeatures.map((feature, index) => (
            <Card key={index} variant="feature" className="group">
              <CardContent className="p-6">
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
