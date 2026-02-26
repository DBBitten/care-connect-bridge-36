export type AppointmentStatus = 'PAYMENT_PENDING' | 'PAID' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
export type PaymentStatus = 'INITIATED' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELED';
export type PaymentMethod = 'SIMULATED' | 'PIX' | 'CARD';

export interface Appointment {
  id: string;
  clientEmail: string;
  caregiverName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  startTime: string;
  durationHours: number;
  pricePerHour: number;
  totalPrice: number;
  platformFee: number;
  caregiverPayout: number;
  status: AppointmentStatus;
  address?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  appointmentId: string;
  status: PaymentStatus;
  amountTotal: number;
  platformFee: number;
  caregiverPayout: number;
  method: PaymentMethod;
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  createdAt: string;
  createdBy: string;
}

export interface PlatformSettings {
  id: string;
  platformFeeRate: number;
  currency: string;
  updatedAt: string;
}
