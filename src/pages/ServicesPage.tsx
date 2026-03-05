import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useServices } from "@/contexts/ServiceContext";
import { useCaregivers } from "@/contexts/CaregiverContext";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users } from "lucide-react";
import { useMemo } from "react";

const ServicesPage = () => {
  const { getActiveServices } = useServices();
  const { getApprovedProfiles } = useCaregivers();
  const navigate = useNavigate();
  const services = getActiveServices();
  const approvedProfiles = getApprovedProfiles();

  const priceRanges = useMemo(() => {
    const map: Record<string, { min: number; max: number; count: number }> = {};
    approvedProfiles.forEach(p => {
      p.serviceOffers.forEach(offer => {
        if (!map[offer.serviceId]) {
          map[offer.serviceId] = { min: offer.pricePerHour, max: offer.pricePerHour, count: 1 };
        } else {
          map[offer.serviceId].min = Math.min(map[offer.serviceId].min, offer.pricePerHour);
          map[offer.serviceId].max = Math.max(map[offer.serviceId].max, offer.pricePerHour);
          map[offer.serviceId].count++;
        }
      });
    });
    return map;
  }, [approvedProfiles]);

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
            {services.map((service) => {
              const range = priceRanges[service.id];
              return (
                <Card key={service.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <CardContent className="flex flex-col flex-1 p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{service.description}</p>

                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        {range ? (
                          <>
                            <span className="text-xs text-muted-foreground">A partir de</span>
                            <p className="text-xl font-bold text-primary">
                              R$ {range.min}<span className="text-sm font-normal text-muted-foreground">/h</span>
                            </p>
                            <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <Users className="w-3 h-3" />{range.count} cuidador{range.count > 1 ? "es" : ""}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-muted-foreground">Consulte os cuidadores</span>
                        )}
                      </div>
                      <Button size="sm" onClick={() => navigate(`/buscar-cuidadores?serviceId=${service.id}`)}>
                        Ver cuidadores <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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
