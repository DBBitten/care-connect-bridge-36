import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Users } from "lucide-react";
import heroImage from "@/assets/hero-eldercare.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cuidadora com paciente idosa feliz"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground px-4 py-2 rounded-full mb-6 animate-fade-up">
            <Heart className="w-4 h-4" />
            <span className="text-sm font-medium">Cuidado com amor e profissionalismo</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Conectando quem precisa de cuidado com{" "}
            <span className="text-primary">quem sabe cuidar</span>
          </h1>

          <p className="text-lg md:text-xl text-background/80 mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Encontre cuidadores qualificados e certificados para você ou seu ente querido. 
            Segurança, confiança e qualidade em cada atendimento.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="xl" variant="hero" asChild>
              <Link to="/cadastro?tipo=necessitado">
                <Users className="w-5 h-5" />
                Preciso de um cuidador
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button size="xl" variant="hero-outline" asChild>
              <Link to="/cadastro?tipo=cuidador">
                <Heart className="w-5 h-5" />
                Quero ser cuidador
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div>
              <p className="text-3xl font-bold text-background">500+</p>
              <p className="text-sm text-background/60">Cuidadores ativos</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-background">2.000+</p>
              <p className="text-sm text-background/60">Famílias atendidas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-background">4.9</p>
              <p className="text-sm text-background/60">Avaliação média</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
