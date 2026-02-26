export interface CaregiverProfileData {
  id: string;
  email: string;
  firstName: string;
  lastInitial: string;
  bio: string;
  yearsExperience?: number;
  specialties: string[];
  languages: string[];
  serviceTags: string[]; // IDs dos serviços que aceita
  certifications: string[]; // badges internos
  neighborhood: string;
  city: string;
  state: string;
  maxDistanceKm?: number;
  profilePhotoUrl?: string;
  availability: string[]; // ex: ["Segunda a Sexta: 6h-18h"]
  hourlyRate: number;
  kycStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaregiverStats {
  caregiverId: string;
  avgRating: number;
  reviewCount: number;
  completedAppointmentsCount: number;
  noShowCount: number;
  updatedAt: string;
}

export interface CaregiverReview {
  id: string;
  caregiverId: string;
  clientEmail: string;
  clientName: string;
  rating: number;
  comment: string;
  appointmentId?: string;
  createdAt: string;
}
