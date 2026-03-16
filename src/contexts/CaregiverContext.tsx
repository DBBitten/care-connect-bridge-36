import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { CaregiverProfileData, CaregiverStats, CaregiverReview } from "@/types/caregiver";
import { seedProfiles, seedStats, seedReviews } from "@/data/caregiverSeed";

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

function calcStats(
  caregiverId: string,
  allReviews: CaregiverReview[],
  existing: CaregiverStats | undefined
): CaregiverStats {
  const caregiverReviews = allReviews.filter(r => r.caregiverId === caregiverId);
  const avgRating = caregiverReviews.length > 0
    ? Math.round((caregiverReviews.reduce((s, r) => s + r.rating, 0) / caregiverReviews.length) * 10) / 10
    : 0;
  return {
    caregiverId,
    avgRating,
    reviewCount: caregiverReviews.length,
    completedAppointmentsCount: existing?.completedAppointmentsCount || 0,
    noShowCount: existing?.noShowCount || 0,
    updatedAt: new Date().toISOString(),
  };
}

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

  const saveProfile = useCallback((profile: CaregiverProfileData) => {
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
    const updatedReviews = [...reviews, review];
    persistReviews(updatedReviews);

    const existing = stats.find(s => s.caregiverId === data.caregiverId);
    const newStats = calcStats(data.caregiverId, updatedReviews, existing);
    persistStats(stats.map(s => s.caregiverId === data.caregiverId ? newStats : s).concat(
      existing ? [] : [newStats]
    ));
  }, [reviews, stats, persistReviews, persistStats]);

  const updateStats = useCallback((caregiverId: string) => {
    const existing = stats.find(s => s.caregiverId === caregiverId);
    const newStats = calcStats(caregiverId, reviews, existing);
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
      saveProfile, addReview, updateStats,
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
