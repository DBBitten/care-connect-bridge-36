import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, MapPin, Clock, GraduationCap, Calendar, CheckCircle } from "lucide-react";

// Mock data - in real app would come from API
const caregiver = {
  id: 1,
  name: "Maria Santos",
  avatar: null,
  rating: 4.9,
  reviews: 48,
  location: "São Paulo - SP",
  certifications: ["Cuidado de Idosos", "Primeiros Socorros", "Mobilidade"],
  availability: ["Segunda a Sexta: 6h - 18h", "Sábados: 8h - 14h"],
  experience: "5 anos",
  bio: "Olá! Sou a Maria, cuidadora profissional há mais de 5 anos. Tenho formação em técnico de enfermagem e me especializei em cuidados com idosos. Sou uma pessoa paciente, atenciosa e dedicada. Acredito que cada pessoa merece cuidado com carinho e respeito. Tenho experiência com pacientes com mobilidade reduzida, demência leve e cuidados pós-operatórios.",
  hourlyRate: 45,
  totalCares: 156,
  memberSince: "2022",
};

const reviews = [
  {
    id: 1,
    author: "Roberto O.",
    rating: 5,
    date: "Jan 2025",
    comment: "Maria cuidou da minha mãe por 3 meses. Profissional, atenciosa e muito carinhosa. Recomendo demais!",
  },
  {
    id: 2,
    author: "Sandra M.",
    rating: 5,
    date: "Dez 2024",
    comment: "Excelente profissional. Pontual e muito competente. Meu pai adorou ela.",
  },
  {
    id: 3,
    author: "Carlos A.",
    rating: 4,
    date: "Nov 2024",
    comment: "Muito boa cuidadora. Atendeu bem às necessidades do meu avô.",
  },
];

const CaregiverProfile = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/buscar-cuidadores" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar à busca
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-32 h-32 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                      <span className="text-4xl font-bold text-secondary-foreground">
                        {caregiver.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h1 className="text-2xl font-bold text-foreground">{caregiver.name}</h1>
                      
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="font-medium text-foreground">{caregiver.rating}</span>
                          <span>({caregiver.reviews} avaliações)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{caregiver.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{caregiver.experience} de experiência</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-4">
                        {caregiver.certifications.map((cert, index) => (
                          <Badge key={index} className="bg-primary/10 text-primary hover:bg-primary/20">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardHeader>
                  <CardTitle>Sobre</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{caregiver.bio}</p>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle>Disponibilidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {caregiver.availability.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{slot}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Avaliações</CardTitle>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-warning fill-warning" />
                    <span className="text-lg font-bold">{caregiver.rating}</span>
                    <span className="text-muted-foreground">({caregiver.reviews})</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-sm font-medium text-secondary-foreground">
                              {review.author[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{review.author}</p>
                            <p className="text-xs text-muted-foreground">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "text-warning fill-warning" : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Booking */}
            <div>
              <Card variant="elevated" className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-foreground">R$ {caregiver.hourlyRate}</span>
                    <span className="text-muted-foreground">/hora</span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="text-sm text-foreground">Perfil verificado</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <span className="text-sm text-foreground">{caregiver.certifications.length} certificações</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <Star className="w-5 h-5 text-warning" />
                      <span className="text-sm text-foreground">{caregiver.totalCares} atendimentos realizados</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" asChild>
                    <Link to={`/agendar/${caregiver.id}`}>
                      <Calendar className="w-4 h-4" />
                      Agendar atendimento
                    </Link>
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Pagamento seguro pela plataforma
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CaregiverProfile;
