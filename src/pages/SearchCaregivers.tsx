import { useState, useMemo } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, MapPin, Star, GraduationCap, Clock, ShieldCheck, CheckCircle, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useCaregivers } from "@/contexts/CaregiverContext";
import { useServices } from "@/contexts/ServiceContext";

const neighborhoods = [
  "Moinhos de Vento", "Bom Fim", "Cidade Baixa", "Petrópolis", "Bela Vista",
  "Menino Deus", "Azenha", "Santana", "Rio Branco", "Floresta",
  "Independência", "Mont'Serrat", "Auxiliadora", "Passo d'Areia", "Higienópolis",
  "Centro Histórico", "Praia de Belas", "Cristal", "Tristeza", "Ipanema",
];

type SortKey = "recommended" | "rating" | "experience";

const SearchCaregivers = () => {
  const { getApprovedProfiles, getStatsForCaregiver } = useCaregivers();
  const { getActiveServices } = useServices();
  const activeServices = getActiveServices();
  const approvedProfiles = getApprovedProfiles();

  const [searchTerm, setSearchTerm] = useState("");
  const [neighborhoodFilter, setNeighborhoodFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [minRating, setMinRating] = useState("");
  const [certFilter, setCertFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("recommended");

  const allCerts = useMemo(() => {
    const set = new Set<string>();
    approvedProfiles.forEach(p => p.certifications.forEach(c => set.add(c)));
    return [...set].sort();
  }, [approvedProfiles]);

  const toggleCert = (c: string) => {
    setCertFilter(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const results = useMemo(() => {
    let list = approvedProfiles.map(p => ({
      profile: p,
      stats: getStatsForCaregiver(p.id),
    }));

    // Filters
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter(({ profile }) => 
        profile.firstName.toLowerCase().includes(q) || profile.bio.toLowerCase().includes(q)
      );
    }
    if (neighborhoodFilter && neighborhoodFilter !== "all") {
      list = list.filter(({ profile }) => profile.neighborhood === neighborhoodFilter);
    }
    if (serviceFilter && serviceFilter !== "all") {
      list = list.filter(({ profile }) => profile.serviceTags.includes(serviceFilter));
    }
    if (minRating && minRating !== "all") {
      const min = parseFloat(minRating);
      list = list.filter(({ stats }) => (stats?.avgRating || 0) >= min);
    }
    if (certFilter.length > 0) {
      list = list.filter(({ profile }) => certFilter.every(c => profile.certifications.includes(c)));
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "rating") return (b.stats?.avgRating || 0) - (a.stats?.avgRating || 0);
      if (sortBy === "experience") return (b.profile.yearsExperience || 0) - (a.profile.yearsExperience || 0);
      // recommended: composite score
      const scoreA = (a.stats?.avgRating || 0) * 10 + (a.stats?.completedAppointmentsCount || 0) * 0.1;
      const scoreB = (b.stats?.avgRating || 0) * 10 + (b.stats?.completedAppointmentsCount || 0) * 0.1;
      return scoreB - scoreA;
    });

    return list;
  }, [approvedProfiles, getStatsForCaregiver, searchTerm, neighborhoodFilter, serviceFilter, minRating, certFilter, sortBy]);

  const clearFilters = () => {
    setSearchTerm(""); setNeighborhoodFilter(""); setServiceFilter("");
    setMinRating(""); setCertFilter([]); setSortBy("recommended");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Encontre o cuidador ideal
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Cuidadores verificados e certificados em Porto Alegre, prontos para ajudar sua família.
            </p>
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-success/10 text-success rounded-full text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              Todos verificados via KYC — Pagamento seguro pela plataforma
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-5">
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="md:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar por nome ou especialidade..." className="pl-10"
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <Select value={neighborhoodFilter} onValueChange={setNeighborhoodFilter}>
                  <SelectTrigger><MapPin className="w-4 h-4 text-muted-foreground mr-2" /><SelectValue placeholder="Bairro" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os bairros</SelectItem>
                    {neighborhoods.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger><Clock className="w-4 h-4 text-muted-foreground mr-2" /><SelectValue placeholder="Serviço" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os serviços</SelectItem>
                    {activeServices.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Rating mínimo:</span>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger className="w-[100px]"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="4">4+ ★</SelectItem>
                      <SelectItem value="4.5">4.5+ ★</SelectItem>
                      <SelectItem value="5">5 ★</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {allCerts.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">Certificações:</span>
                    {allCerts.map(c => (
                      <label key={c} className="flex items-center gap-1.5 cursor-pointer">
                        <Checkbox checked={certFilter.includes(c)} onCheckedChange={() => toggleCert(c)} className="h-4 w-4" />
                        <span className="text-xs">{c}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results bar */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">{results.length}</span> cuidadores encontrados
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Ordenar:</span>
              <Select value={sortBy} onValueChange={v => setSortBy(v as SortKey)}>
                <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recomendados</SelectItem>
                  <SelectItem value="rating">Mais bem avaliados</SelectItem>
                  <SelectItem value="experience">Mais experientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {results.map(({ profile, stats }) => (
              <Card key={profile.id} variant="feature">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0">
                      {profile.profilePhotoUrl ? (
                        <img src={profile.profilePhotoUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <span className="text-2xl font-bold text-secondary-foreground">
                          {profile.firstName[0]}{profile.lastInitial}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {profile.firstName} {profile.lastInitial}.
                          </h3>
                          <ShieldCheck className="w-4 h-4 text-success" />
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="font-medium text-foreground">{stats?.avgRating || "—"}</span>
                          <span className="text-muted-foreground">({stats?.reviewCount || 0})</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.neighborhood}</span>
                        {profile.yearsExperience && (
                          <><span>•</span><span>{profile.yearsExperience} anos exp.</span></>
                        )}
                        {stats && stats.completedAppointmentsCount > 0 && (
                          <><span>•</span><span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-success" />{stats.completedAppointmentsCount} atendimentos</span></>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{profile.bio}</p>

                      <div className="flex flex-wrap gap-1 mt-3">
                        {profile.certifications.slice(0, 3).map((cert, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            <GraduationCap className="w-3 h-3 mr-1" />{cert}
                          </Badge>
                        ))}
                        {profile.certifications.length > 3 && (
                          <Badge variant="secondary" className="text-xs">+{profile.certifications.length - 3}</Badge>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div>
                          <span className="text-lg font-bold text-foreground">R$ {profile.hourlyRate}</span>
                          <span className="text-sm text-muted-foreground">/hora</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/cuidador/${profile.id}`}>Ver perfil</Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link to={`/agendar/${profile.id}`}>
                              <Calendar className="w-3 h-3 mr-1" />Agendar
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">Nenhum cuidador encontrado com os filtros selecionados.</p>
              <Button variant="outline" className="mt-4" onClick={clearFilters}>Limpar filtros</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchCaregivers;
