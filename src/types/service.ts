export interface Service {
  id: string;
  name: string;
  description: string;
  baseDurationMinutes: number;
  allowedDurationsMinutes: number[];
  pricePerHour: number;
  minHours: number;
  maxHours: number;
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
