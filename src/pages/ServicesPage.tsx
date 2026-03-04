import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useServices } from "@/contexts/ServiceContext";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";

function formatDuration(minutes: number) {
  return minutes >= 60 ? `${minutes / 60}h` : `${minutes}min`;
}

const ServicesPage = () => {
  const { getActiveServices } = useServices();
  const navigate = useNavigate();
  const services = getActiveServices();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Nossos Serviços
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conheça os serviços de cuidado oferecidos pela Cuidare em Porto Alegre. Todos os cuidadores são verificados e treinados.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {services.map((service) => (
              <Card key={service.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardContent className="flex flex-col flex-1 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{service.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {service.allowedDurationsMinutes.map((d) => (
                      <Badge key={d} variant="secondary" className="text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(d)}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <span className="text-xs text-muted-foreground">A partir de</span>
                      <p className="text-xl font-bold text-primary">
                        R$ {service.pricePerHour}<span className="text-sm font-normal text-muted-foreground">/h</span>
                      </p>
                    </div>
                    <Button size="sm" onClick={() => navigate(`/agendar/1?serviceId=${service.id}`)}>
                      Agendar <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <p className="text-center text-muted-foreground py-12">Nenhum serviço disponível no momento.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
