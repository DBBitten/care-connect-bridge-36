import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, MapPin, Clock, GraduationCap, Calendar, CheckCircle, ShieldCheck } from "lucide-react";
import { useCaregivers } from "@/contexts/CaregiverContext";
import { useServices } from "@/contexts/ServiceContext";

const REVIEWS_PER_PAGE = 5;

const CaregiverProfile = () => {
  const { id } = useParams();
  const { getProfileById, getStatsForCaregiver, getReviewsForCaregiver } = useCaregivers();
  const { getServiceById } = useServices();

  const profile = getProfileById(id || "");
  const stats = getStatsForCaregiver(id || "");
  const allReviews = getReviewsForCaregiver(id || "");
  const [reviewPage, setReviewPage] = useState(1);

  const paginatedReviews = useMemo(() =>
    allReviews.slice(0, reviewPage * REVIEWS_PER_PAGE), [allReviews, reviewPage]);

  if (!profile || profile.kycStatus !== "APPROVED" || profile.isSuspended) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Cuidador não encontrado</h1>
          <p className="text-muted-foreground mb-6">Este perfil não está disponível.</p>
          <Button asChild><Link to="/buscar-cuidadores">Voltar à busca</Link></Button>
        </main>
        <Footer />
      </div>
    );
  }

  const serviceNames = profile.serviceTags
    .map(id => getServiceById(id))
    .filter(Boolean)
    .map(s => s!.name);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/buscar-cuidadores" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" />Voltar à busca
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-32 h-32 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                      {profile.profilePhotoUrl ? (
                        <img src={profile.profilePhotoUrl} alt="" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <span className="text-4xl font-bold text-secondary-foreground">
                          {profile.firstName[0]}{profile.lastInitial}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h1 className="text-2xl font-bold text-foreground">{profile.firstName} {profile.lastInitial}.</h1>
                        <ShieldCheck className="w-5 h-5 text-success" />
                      </div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="font-medium text-foreground">{stats?.avgRating || "—"}</span>
                          <span>({stats?.reviewCount || 0} avaliações)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /><span>{profile.neighborhood}, {profile.city}</span>
                        </div>
                        {profile.yearsExperience && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /><span>{profile.yearsExperience} anos de experiência</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-4">
                        {profile.certifications.map((cert, i) => (
                          <Badge key={i} className="bg-primary/10 text-primary hover:bg-primary/20">
                            <GraduationCap className="w-3 h-3 mr-1" />{cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bio */}
              <Card>
                <CardHeader><CardTitle>Sobre</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
                  {profile.specialties.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-foreground mb-2">Especialidades:</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialties.map((s, i) => <Badge key={i} variant="outline">{s}</Badge>)}
                      </div>
                    </div>
                  )}
                  {profile.languages.length > 1 && (
                    <p className="text-sm text-muted-foreground mt-3">
                      Idiomas: {profile.languages.join(", ")}
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Services */}
              {serviceNames.length > 0 && (
                <Card>
                  <CardHeader><CardTitle>Serviços</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {serviceNames.map((name, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-muted/50">
                          <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                          <span className="text-sm">{name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Availability */}
              <Card>
                <CardHeader><CardTitle>Disponibilidade</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {profile.availability.map((slot, i) => (
                      <div key={i} className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" /><span>{slot}</span>
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
                    <span className="text-lg font-bold">{stats?.avgRating || "—"}</span>
                    <span className="text-muted-foreground">({stats?.reviewCount || 0})</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paginatedReviews.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma avaliação ainda.</p>
                  )}
                  {paginatedReviews.map((review) => (
                    <div key={review.id} className="p-4 rounded-xl bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-sm font-medium text-secondary-foreground">{review.clientName[0]}</span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{review.clientName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-warning fill-warning" : "text-muted"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                  {allReviews.length > paginatedReviews.length && (
                    <Button variant="outline" className="w-full" onClick={() => setReviewPage(p => p + 1)}>
                      Ver mais avaliações
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div>
              <Card variant="elevated" className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <span className="text-3xl font-bold text-foreground">R$ {profile.hourlyRate}</span>
                    <span className="text-muted-foreground">/hora</span>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <ShieldCheck className="w-5 h-5 text-success" />
                      <span className="text-sm text-foreground">Perfil verificado via KYC</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                      <GraduationCap className="w-5 h-5 text-primary" />
                      <span className="text-sm text-foreground">{profile.certifications.length} certificações</span>
                    </div>
                    {stats && stats.completedAppointmentsCount > 0 && (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                        <CheckCircle className="w-5 h-5 text-success" />
                        <span className="text-sm text-foreground">{stats.completedAppointmentsCount} atendimentos realizados</span>
                      </div>
                    )}
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link to={`/agendar/${profile.id}`}>
                      <Calendar className="w-4 h-4 mr-2" />Agendar atendimento
                    </Link>
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Pagamento seguro pela plataforma
                  </p>

                  {/* Anti-bypass notice */}
                  <div className="mt-4 p-3 rounded-xl bg-muted/30 border border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      🔒 Contatos do cuidador são compartilhados apenas após confirmação do pagamento, para sua segurança.
                    </p>
                  </div>
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
