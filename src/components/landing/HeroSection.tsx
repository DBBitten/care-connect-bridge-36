import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Users } from "lucide-react";
import heroImage from "@/assets/hero-cuidare.png";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cuidadora com paciente idosa feliz"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.48)] via-[rgba(0,0,0,0.30)] to-[rgba(0,0,0,0.18)]" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/[0.14] backdrop-blur-sm border border-white/20 text-white px-4 py-2 rounded-full mb-6 animate-fade-up">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm font-medium">Profissionais verificados e treinados</span>
          </div>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-[680px] animate-fade-up"
            style={{ animationDelay: "0.1s", textShadow: "0 2px 8px rgba(0,0,0,0.18)" }}
          >
            Cuidado de confiança para quem você{" "}
            <span className="text-primary">ama</span>
          </h1>

          <p
            className="text-lg md:text-xl text-white/90 mb-8 max-w-[600px] animate-fade-up"
            style={{ animationDelay: "0.2s", textShadow: "0 1px 4px rgba(0,0,0,0.12)" }}
          >
            Encontre cuidadores verificados para acompanhar sua família com segurança, atenção e carinho.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button size="xl" variant="hero" asChild>
              <Link to="/cadastro?tipo=necessitado">
                <Users className="w-5 h-5" />
                Preciso de um cuidador
              </Link>
            </Button>
            <Button
              size="xl"
              variant="hero-outline"
              className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 hover:text-white"
              asChild
            >
              <Link to="/cadastro?tipo=cuidador">
                <ShieldCheck className="w-5 h-5" />
                Quero ser cuidador
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-12 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-white/70">Cuidadores verificados</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">2.000+</p>
              <p className="text-sm text-white/70">Famílias atendidas</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">4.9</p>
              <p className="text-sm text-white/70">Avaliação média</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
