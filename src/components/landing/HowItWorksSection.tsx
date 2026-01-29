import { Search, CalendarCheck, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Encontre o cuidador ideal",
    description: "Busque por localização, disponibilidade e tipo de cuidado. Veja avaliações e certificações.",
  },
  {
    icon: CalendarCheck,
    title: "Agende com segurança",
    description: "Escolha a data e horário. Pagamento seguro pela plataforma, sem preocupações.",
  },
  {
    icon: Star,
    title: "Receba cuidado de qualidade",
    description: "Acompanhe o atendimento e avalie após. Cuidadores certificados e preparados.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Encontrar um cuidador de confiança nunca foi tão simples. Em três passos, você garante o melhor cuidado.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-border" />
              )}
              
              <div className="text-center">
                {/* Step number */}
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center mx-auto">
                    <step.icon className="w-12 h-12 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
