import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { CaregiverProfileData, CaregiverStats, CaregiverReview } from "@/types/caregiver";

const KEYS = {
  profiles: "eldercare_caregiver_profiles",
  stats: "eldercare_caregiver_stats",
  reviews: "eldercare_caregiver_reviews",
};

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const s = localStorage.getItem(key);
    if (s) return JSON.parse(s);
  } catch {}
  return fallback;
}
function save(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

const seedProfiles: CaregiverProfileData[] = [
  {
    id: "cg-1", email: "maria@email.com", firstName: "Maria", lastInitial: "S",
    bio: "Cuidadora profissional há mais de 5 anos. Formação em técnico de enfermagem, especializada em cuidados com idosos. Paciente, atenciosa e dedicada. Experiência com mobilidade reduzida, demência leve e cuidados pós-operatórios.",
    yearsExperience: 5, specialties: ["Mobilidade reduzida", "Demência leve", "Pós-operatório"],
    languages: ["Português"], serviceTags: ["svc-1", "svc-2", "svc-3", "svc-5"],
    certifications: ["Cuidado de Idosos", "Primeiros Socorros", "Mobilidade Básica"],
    neighborhood: "Moinhos de Vento", city: "Porto Alegre", state: "RS", maxDistanceKm: 15,
    profilePhotoUrl: undefined,
    availability: ["Segunda a Sexta: 6h - 18h", "Sábados: 8h - 14h"],
    hourlyRate: 45, kycStatus: "APPROVED", isSuspended: false,
    createdAt: "2024-01-01T00:00:00Z", updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "cg-2", email: "ana@email.com", firstName: "Ana", lastInitial: "O",
    bio: "Formada em enfermagem, com experiência em cuidados domiciliares. Atenciosa, paciente e apaixonada pelo cuidado humanizado. Especializada em nutrição para idosos.",
    yearsExperience: 3, specialties: ["Nutrição", "Cuidados domiciliares"],
    languages: ["Português", "Espanhol"], serviceTags: ["svc-1", "svc-3", "svc-4"],
    certifications: ["Cuidado de Idosos", "Nutrição"],
    neighborhood: "Bom Fim", city: "Porto Alegre", state: "RS", maxDistanceKm: 10,
    profilePhotoUrl: undefined,
    availability: ["Segunda a Sexta: 7h - 19h", "Sábados e Domingos: 8h - 16h"],
    hourlyRate: 50, kycStatus: "APPROVED", isSuspended: false,
    createdAt: "2024-03-01T00:00:00Z", updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "cg-3", email: "jose@email.com", firstName: "José", lastInitial: "S",
    bio: "Especialista em cuidados noturnos e pernoite. Vasta experiência com pacientes com demência e Alzheimer. Calmo, responsável e confiável.",
    yearsExperience: 4, specialties: ["Demência", "Alzheimer", "Cuidado noturno"],
    languages: ["Português"], serviceTags: ["svc-1", "svc-2"],
    certifications: ["Cuidado de Idosos", "Mobilidade Básica"],
    neighborhood: "Cidade Baixa", city: "Porto Alegre", state: "RS", maxDistanceKm: 20,
    profilePhotoUrl: undefined,
    availability: ["Segunda a Sexta: 18h - 06h", "Sábados e Domingos: disponível"],
    hourlyRate: 55, kycStatus: "APPROVED", isSuspended: false,
    createdAt: "2024-02-01T00:00:00Z", updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "cg-4", email: "carla@email.com", firstName: "Carla", lastInitial: "M",
    bio: "Mais de 8 anos de experiência. Especialização em Alzheimer e demências. Referência em cuidados humanizados com formação completa em geriatria.",
    yearsExperience: 8, specialties: ["Alzheimer", "Demência", "Geriatria"],
    languages: ["Português", "Inglês"], serviceTags: ["svc-1", "svc-2", "svc-3", "svc-4", "svc-5"],
    certifications: ["Cuidado de Idosos", "Primeiros Socorros", "Alzheimer", "Nutrição"],
    neighborhood: "Petrópolis", city: "Porto Alegre", state: "RS", maxDistanceKm: 25,
    profilePhotoUrl: undefined,
    availability: ["Segunda a Sexta: 8h - 12h"],
    hourlyRate: 65, kycStatus: "APPROVED", isSuspended: false,
    createdAt: "2023-06-01T00:00:00Z", updatedAt: "2024-12-01T00:00:00Z",
  },
  {
    id: "cg-5", email: "fernanda@email.com", firstName: "Fernanda", lastInitial: "C",
    bio: "Cuidadora dedicada, em processo de verificação. Aguardando aprovação do KYC.",
    yearsExperience: 1, specialties: [],
    languages: ["Português"], serviceTags: ["svc-1"],
    certifications: [],
    neighborhood: "Gravataí", city: "Gravataí", state: "RS",
    profilePhotoUrl: undefined,
    availability: ["Segunda a Sexta: 8h - 17h"],
    hourlyRate: 30, kycStatus: "PENDING", isSuspended: false,
    createdAt: "2025-01-01T00:00:00Z", updatedAt: "2025-01-01T00:00:00Z",
  },
];

const seedStats: CaregiverStats[] = [
  { caregiverId: "cg-1", avgRating: 4.9, reviewCount: 48, completedAppointmentsCount: 156, noShowCount: 1, updatedAt: "2025-02-01T00:00:00Z" },
  { caregiverId: "cg-2", avgRating: 4.8, reviewCount: 35, completedAppointmentsCount: 89, noShowCount: 0, updatedAt: "2025-02-01T00:00:00Z" },
  { caregiverId: "cg-3", avgRating: 4.7, reviewCount: 22, completedAppointmentsCount: 67, noShowCount: 2, updatedAt: "2025-02-01T00:00:00Z" },
  { caregiverId: "cg-4", avgRating: 5.0, reviewCount: 62, completedAppointmentsCount: 210, noShowCount: 0, updatedAt: "2025-02-01T00:00:00Z" },
];

const seedReviews: CaregiverReview[] = [
  { id: "rev-1", caregiverId: "cg-1", clientEmail: "roberto@email.com", clientName: "Roberto O.", rating: 5, comment: "Maria cuidou da minha mãe por 3 meses. Profissional, atenciosa e muito carinhosa. Recomendo demais!", createdAt: "2025-01-15T00:00:00Z" },
  { id: "rev-2", caregiverId: "cg-1", clientEmail: "sandra@email.com", clientName: "Sandra M.", rating: 5, comment: "Excelente profissional. Pontual e muito competente. Meu pai adorou ela.", createdAt: "2024-12-20T00:00:00Z" },
  { id: "rev-3", caregiverId: "cg-1", clientEmail: "carlos@email.com", clientName: "Carlos A.", rating: 4, comment: "Muito boa cuidadora. Atendeu bem às necessidades do meu avô.", createdAt: "2024-11-10T00:00:00Z" },
  { id: "rev-4", caregiverId: "cg-2", clientEmail: "lucia@email.com", clientName: "Lúcia F.", rating: 5, comment: "Ana é maravilhosa! Muito cuidadosa com a alimentação da minha mãe.", createdAt: "2025-01-20T00:00:00Z" },
  { id: "rev-5", caregiverId: "cg-2", clientEmail: "pedro@email.com", clientName: "Pedro R.", rating: 5, comment: "Profissional excepcional. Recomendo sem hesitar.", createdAt: "2025-01-05T00:00:00Z" },
  { id: "rev-6", caregiverId: "cg-4", clientEmail: "marta@email.com", clientName: "Marta L.", rating: 5, comment: "Carla é a melhor cuidadora que já encontramos. Experiência incrível com Alzheimer.", createdAt: "2025-02-01T00:00:00Z" },
  { id: "rev-7", caregiverId: "cg-4", clientEmail: "joao@email.com", clientName: "João V.", rating: 5, comment: "Profissional referência. Humanizada e competente.", createdAt: "2025-01-25T00:00:00Z" },
  { id: "rev-8", caregiverId: "cg-4", clientEmail: "regina@email.com", clientName: "Regina B.", rating: 5, comment: "Nota 10. A melhor do mercado.", createdAt: "2024-12-15T00:00:00Z" },
  { id: "rev-9", caregiverId: "cg-3", clientEmail: "andre@email.com", clientName: "André S.", rating: 5, comment: "José é muito confiável para cuidados noturnos. Dormimos tranquilos.", createdAt: "2025-01-10T00:00:00Z" },
  { id: "rev-10", caregiverId: "cg-3", clientEmail: "paula@email.com", clientName: "Paula M.", rating: 4, comment: "Bom profissional, pontual e atencioso.", createdAt: "2024-11-20T00:00:00Z" },
];

interface CaregiverContextType {
  profiles: CaregiverProfileData[];
  stats: CaregiverStats[];
  reviews: CaregiverReview[];
  getProfileById: (id: string) => CaregiverProfileData | undefined;
  getProfileByEmail: (email: string) => CaregiverProfileData | undefined;
  getApprovedProfiles: () => CaregiverProfileData[];
  getStatsForCaregiver: (id: string) => CaregiverStats | undefined;
  getReviewsForCaregiver: (id: string) => CaregiverReview[];
  saveProfile: (profile: CaregiverProfileData) => void;
  addReview: (review: Omit<CaregiverReview, "id" | "createdAt">) => void;
  updateStats: (caregiverId: string) => void;
}

const CaregiverContext = createContext<CaregiverContextType | null>(null);

export function CaregiverProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<CaregiverProfileData[]>(() => load(KEYS.profiles, seedProfiles));
  const [stats, setStats] = useState<CaregiverStats[]>(() => load(KEYS.stats, seedStats));
  const [reviews, setReviews] = useState<CaregiverReview[]>(() => load(KEYS.reviews, seedReviews));

  const persistProfiles = useCallback((p: CaregiverProfileData[]) => { setProfiles(p); save(KEYS.profiles, p); }, []);
  const persistStats = useCallback((s: CaregiverStats[]) => { setStats(s); save(KEYS.stats, s); }, []);
  const persistReviews = useCallback((r: CaregiverReview[]) => { setReviews(r); save(KEYS.reviews, r); }, []);

  const getProfileById = useCallback((id: string) => profiles.find(p => p.id === id), [profiles]);
  const getProfileByEmail = useCallback((email: string) => profiles.find(p => p.email === email), [profiles]);
  
  const getApprovedProfiles = useCallback(() => 
    profiles.filter(p => p.kycStatus === "APPROVED" && !p.isSuspended), [profiles]);

  const getStatsForCaregiver = useCallback((id: string) => stats.find(s => s.caregiverId === id), [stats]);
  const getReviewsForCaregiver = useCallback((id: string) => 
    reviews.filter(r => r.caregiverId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [reviews]);

  const saveProfileFn = useCallback((profile: CaregiverProfileData) => {
    const exists = profiles.find(p => p.id === profile.id);
    const updated = exists 
      ? profiles.map(p => p.id === profile.id ? { ...profile, updatedAt: new Date().toISOString() } : p)
      : [...profiles, { ...profile, updatedAt: new Date().toISOString() }];
    persistProfiles(updated);
  }, [profiles, persistProfiles]);

  const addReview = useCallback((data: Omit<CaregiverReview, "id" | "createdAt">) => {
    const review: CaregiverReview = {
      ...data,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [...reviews, review];
    persistReviews(updated);

    // Recalculate stats
    const caregiverReviews = updated.filter(r => r.caregiverId === data.caregiverId);
    const avgRating = Math.round((caregiverReviews.reduce((s, r) => s + r.rating, 0) / caregiverReviews.length) * 10) / 10;
    const existing = stats.find(s => s.caregiverId === data.caregiverId);
    const newStats: CaregiverStats = {
      caregiverId: data.caregiverId,
      avgRating,
      reviewCount: caregiverReviews.length,
      completedAppointmentsCount: existing?.completedAppointmentsCount || 0,
      noShowCount: existing?.noShowCount || 0,
      updatedAt: new Date().toISOString(),
    };
    persistStats(stats.map(s => s.caregiverId === data.caregiverId ? newStats : s).concat(
      stats.find(s => s.caregiverId === data.caregiverId) ? [] : [newStats]
    ));
  }, [reviews, stats, persistReviews, persistStats]);

  const updateStatsFn = useCallback((caregiverId: string) => {
    const caregiverReviews = reviews.filter(r => r.caregiverId === caregiverId);
    const avgRating = caregiverReviews.length > 0
      ? Math.round((caregiverReviews.reduce((s, r) => s + r.rating, 0) / caregiverReviews.length) * 10) / 10
      : 0;
    const existing = stats.find(s => s.caregiverId === caregiverId);
    const newStats: CaregiverStats = {
      caregiverId,
      avgRating,
      reviewCount: caregiverReviews.length,
      completedAppointmentsCount: existing?.completedAppointmentsCount || 0,
      noShowCount: existing?.noShowCount || 0,
      updatedAt: new Date().toISOString(),
    };
    const updatedStats = existing 
      ? stats.map(s => s.caregiverId === caregiverId ? newStats : s)
      : [...stats, newStats];
    persistStats(updatedStats);
  }, [reviews, stats, persistStats]);

  return (
    <CaregiverContext.Provider value={{
      profiles, stats, reviews,
      getProfileById, getProfileByEmail, getApprovedProfiles,
      getStatsForCaregiver, getReviewsForCaregiver,
      saveProfile: saveProfileFn, addReview, updateStats: updateStatsFn,
    }}>
      {children}
    </CaregiverContext.Provider>
  );
}

export function useCaregivers() {
  const ctx = useContext(CaregiverContext);
  if (!ctx) throw new Error("useCaregivers must be used within CaregiverProvider");
  return ctx;
}
