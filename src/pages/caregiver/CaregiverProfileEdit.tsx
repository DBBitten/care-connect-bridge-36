import { useState, useEffect } from "react";
import { CaregiverLayout } from "@/components/caregiver/CaregiverLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Camera, MapPin, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useCaregivers } from "@/contexts/CaregiverContext";
import { useServices } from "@/contexts/ServiceContext";
import { CaregiverProfileData } from "@/types/caregiver";

const neighborhoods = [
  "Moinhos de Vento", "Bom Fim", "Cidade Baixa", "Petrópolis", "Bela Vista",
  "Menino Deus", "Azenha", "Santana", "Rio Branco", "Floresta",
  "Independência", "Mont'Serrat", "Auxiliadora", "Passo d'Areia", "Higienópolis",
  "Centro Histórico", "Praia de Belas", "Cristal", "Tristeza", "Ipanema",
];

export default function CaregiverProfileEdit() {
  const { user } = useAuth();
  const { getProfileByEmail, saveProfile } = useCaregivers();
  const { getActiveServices } = useServices();
  const activeServices = getActiveServices();

  const existing = getProfileByEmail(user?.email || "");

  const [bio, setBio] = useState(existing?.bio || "");
  const [yearsExperience, setYearsExperience] = useState(existing?.yearsExperience?.toString() || "");
  const [specialties, setSpecialties] = useState(existing?.specialties?.join(", ") || "");
  const [languages, setLanguages] = useState(existing?.languages?.join(", ") || "Português");
  const [neighborhood, setNeighborhood] = useState(existing?.neighborhood || "");
  const [maxDistanceKm, setMaxDistanceKm] = useState(existing?.maxDistanceKm?.toString() || "");
  const [hourlyRate, setHourlyRate] = useState(existing?.hourlyRate?.toString() || "35");
  const [selectedServices, setSelectedServices] = useState<string[]>(existing?.serviceTags || []);
  const [availabilityText, setAvailabilityText] = useState(existing?.availability?.join("\n") || "");

  const toggleService = (id: string) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleSave = () => {
    if (!bio.trim()) { toast.error("Preencha sua bio."); return; }
    if (!neighborhood) { toast.error("Selecione seu bairro."); return; }
    if (selectedServices.length === 0) { toast.error("Selecione ao menos um serviço."); return; }

    const email = user?.email || "";
    const profile: CaregiverProfileData = {
      id: existing?.id || `cg-${Date.now()}`,
      email,
      firstName: existing?.firstName || email.split("@")[0],
      lastInitial: existing?.lastInitial || "",
      bio: bio.trim(),
      yearsExperience: yearsExperience ? parseInt(yearsExperience) : undefined,
      specialties: specialties.split(",").map(s => s.trim()).filter(Boolean),
      languages: languages.split(",").map(s => s.trim()).filter(Boolean),
      serviceTags: selectedServices,
      certifications: existing?.certifications || [],
      neighborhood,
      city: existing?.city || "Porto Alegre",
      state: existing?.state || "RS",
      maxDistanceKm: maxDistanceKm ? parseInt(maxDistanceKm) : undefined,
      profilePhotoUrl: existing?.profilePhotoUrl,
      availability: availabilityText.split("\n").map(s => s.trim()).filter(Boolean),
      hourlyRate: parseFloat(hourlyRate) || 35,
      kycStatus: existing?.kycStatus || "PENDING",
      isSuspended: existing?.isSuspended || false,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProfile(profile);
    toast.success("Perfil salvo com sucesso!");
  };

  return (
    <CaregiverLayout title="Meu Perfil" subtitle="Complete seu perfil para ser encontrado por famílias">
      <div className="max-w-3xl space-y-6">
        {/* Photo */}
        <Card>
          <CardHeader><CardTitle className="text-base">Foto de Perfil</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-2xl bg-secondary flex items-center justify-center">
                {existing?.profilePhotoUrl ? (
                  <img src={existing.profilePhotoUrl} alt="Foto" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <Camera className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Upload de foto será implementado com backend.</p>
                <p className="text-xs text-muted-foreground mt-1">JPG ou PNG, até 5MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio & Experience */}
        <Card>
          <CardHeader><CardTitle className="text-base">Sobre Você</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={bio} onChange={e => setBio(e.target.value)}
                placeholder="Descreva sua experiência, formação e abordagem no cuidado..."
                className="mt-1" rows={4} maxLength={500} />
              <p className="text-xs text-muted-foreground mt-1">{bio.length}/500 caracteres</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="years">Anos de experiência</Label>
                <Input id="years" type="number" min="0" max="50" value={yearsExperience}
                  onChange={e => setYearsExperience(e.target.value)} placeholder="Ex: 5" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="rate">Valor por hora (R$)</Label>
                <Input id="rate" type="number" min="20" max="200" value={hourlyRate}
                  onChange={e => setHourlyRate(e.target.value)} placeholder="Ex: 45" className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="specialties">Especialidades (separadas por vírgula)</Label>
              <Input id="specialties" value={specialties} onChange={e => setSpecialties(e.target.value)}
                placeholder="Mobilidade, Alzheimer, Nutrição..." className="mt-1" />
            </div>
            <div>
              <Label htmlFor="languages">Idiomas (separados por vírgula)</Label>
              <Input id="languages" value={languages} onChange={e => setLanguages(e.target.value)}
                placeholder="Português, Espanhol..." className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><MapPin className="w-4 h-4" />Localização</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Bairro</Label>
              <Select value={neighborhood} onValueChange={setNeighborhood}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Selecione seu bairro" /></SelectTrigger>
                <SelectContent>
                  {neighborhoods.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="distance">Distância máxima de atendimento (km)</Label>
              <Input id="distance" type="number" min="1" max="50" value={maxDistanceKm}
                onChange={e => setMaxDistanceKm(e.target.value)} placeholder="Ex: 15" className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><GraduationCap className="w-4 h-4" />Serviços que Aceito</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activeServices.map(svc => (
                <div key={svc.id} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50">
                  <Checkbox id={svc.id} checked={selectedServices.includes(svc.id)}
                    onCheckedChange={() => toggleService(svc.id)} />
                  <Label htmlFor={svc.id} className="cursor-pointer flex-1">
                    <span className="font-medium">{svc.name}</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{svc.description}</p>
                  </Label>
                  <Badge variant="secondary" className="text-xs">R$ {svc.pricePerHour}/h</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Availability */}
        <Card>
          <CardHeader><CardTitle className="text-base">Disponibilidade</CardTitle></CardHeader>
          <CardContent>
            <Label htmlFor="availability">Uma linha por horário disponível</Label>
            <Textarea id="availability" value={availabilityText} onChange={e => setAvailabilityText(e.target.value)}
              placeholder={"Segunda a Sexta: 8h - 18h\nSábados: 8h - 14h"} className="mt-1" rows={3} />
          </CardContent>
        </Card>

        {/* Certifications (read-only) */}
        {existing?.certifications && existing.certifications.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Certificações</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {existing.certifications.map((c, i) => (
                  <Badge key={i} className="bg-primary/10 text-primary"><GraduationCap className="w-3 h-3 mr-1" />{c}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Certificações são concedidas ao completar cursos na plataforma.</p>
            </CardContent>
          </Card>
        )}

        <Button onClick={handleSave} size="lg" className="w-full">
          <Save className="w-4 h-4 mr-2" />Salvar Perfil
        </Button>
      </div>
    </CaregiverLayout>
  );
}
