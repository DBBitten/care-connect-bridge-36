import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, GraduationCap, Clock, Filter } from "lucide-react";
import { Link } from "react-router-dom";

const caregivers = [
  {
    id: 1,
    name: "Maria Santos",
    avatar: null,
    rating: 4.9,
    reviews: 48,
    location: "São Paulo - SP",
    certifications: ["Cuidado de Idosos", "Primeiros Socorros", "Mobilidade"],
    availability: "Manhã e Tarde",
    experience: "5 anos",
    bio: "Cuidadora experiente e dedicada. Especializada em cuidados com idosos e pessoas com mobilidade reduzida.",
    hourlyRate: 45,
  },
  {
    id: 2,
    name: "Ana Oliveira",
    avatar: null,
    rating: 4.8,
    reviews: 35,
    location: "São Paulo - SP",
    certifications: ["Cuidado de Idosos", "Nutrição"],
    availability: "Integral",
    experience: "3 anos",
    bio: "Formada em enfermagem, com experiência em cuidados domiciliares. Atenciosa e paciente.",
    hourlyRate: 50,
  },
  {
    id: 3,
    name: "José Silva",
    avatar: null,
    rating: 4.7,
    reviews: 22,
    location: "Santo André - SP",
    certifications: ["Cuidado de Idosos", "Mobilidade"],
    availability: "Noite e Pernoite",
    experience: "4 anos",
    bio: "Especialista em cuidados noturnos. Experiência com pacientes com demência.",
    hourlyRate: 55,
  },
  {
    id: 4,
    name: "Carla Mendes",
    avatar: null,
    rating: 5.0,
    reviews: 62,
    location: "São Paulo - SP",
    certifications: ["Cuidado de Idosos", "Primeiros Socorros", "Alzheimer", "Nutrição"],
    availability: "Manhã",
    experience: "8 anos",
    bio: "Mais de 8 anos de experiência. Especialização em Alzheimer e demências. Referência em cuidados humanizados.",
    hourlyRate: 65,
  },
];

const SearchCaregivers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  const filteredCaregivers = caregivers.filter((caregiver) => {
    const matchesSearch = caregiver.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || caregiver.location.includes(locationFilter);
    const matchesAvailability = !availabilityFilter || caregiver.availability.toLowerCase().includes(availabilityFilter.toLowerCase());
    return matchesSearch && matchesLocation && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Encontre o cuidador ideal
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cuidadores verificados e certificados prontos para ajudar você e sua família.
            </p>
          </div>

          {/* Search & Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nome..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <MapPin className="w-4 h-4 text-muted-foreground mr-2" />
                    <SelectValue placeholder="Localização" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="São Paulo">São Paulo - SP</SelectItem>
                    <SelectItem value="Santo André">Santo André - SP</SelectItem>
                    <SelectItem value="Campinas">Campinas - SP</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <Clock className="w-4 h-4 text-muted-foreground mr-2" />
                    <SelectValue placeholder="Disponibilidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Qualquer</SelectItem>
                    <SelectItem value="manhã">Manhã</SelectItem>
                    <SelectItem value="tarde">Tarde</SelectItem>
                    <SelectItem value="noite">Noite</SelectItem>
                    <SelectItem value="integral">Integral</SelectItem>
                    <SelectItem value="pernoite">Pernoite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{filteredCaregivers.length}</span> cuidadores encontrados
            </p>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Mais filtros
            </Button>
          </div>

          {/* Caregivers Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredCaregivers.map((caregiver) => (
              <Card key={caregiver.id} variant="feature">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-secondary-foreground">
                        {caregiver.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{caregiver.name}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="font-medium text-foreground">{caregiver.rating}</span>
                          <span className="text-muted-foreground">({caregiver.reviews})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{caregiver.location}</span>
                        <span className="mx-1">•</span>
                        <span>{caregiver.experience} de experiência</span>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {caregiver.bio}
                      </p>

                      {/* Certifications */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {caregiver.certifications.slice(0, 3).map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                        {caregiver.certifications.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{caregiver.certifications.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div>
                          <span className="text-lg font-bold text-foreground">R$ {caregiver.hourlyRate}</span>
                          <span className="text-sm text-muted-foreground">/hora</span>
                        </div>
                        <Button asChild>
                          <Link to={`/cuidador/${caregiver.id}`}>Ver perfil</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCaregivers.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                Nenhum cuidador encontrado com os filtros selecionados.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => {
                setSearchTerm("");
                setLocationFilter("");
                setAvailabilityFilter("");
              }}>
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchCaregivers;
