export interface Service {
  id: string;
  name: string;
  description: string;
  requiresCertificationTag?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePriceRule {
  id: string;
  serviceId: string;
  ruleType: 'WEEKEND' | 'NIGHT' | 'URGENT';
  multiplier: number;
  isActive: boolean;
}

export interface CaregiverServiceOffer {
  serviceId: string;
  pricePerHour: number;
}
