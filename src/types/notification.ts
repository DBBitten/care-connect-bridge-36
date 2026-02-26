export type NotificationType =
  | 'APPOINTMENT_REQUESTED'
  | 'APPOINTMENT_CONFIRMED'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_CONFIRMED'
  | 'APPOINTMENT_REMINDER_24H'
  | 'APPOINTMENT_REMINDER_2H'
  | 'APPOINTMENT_CANCELED'
  | 'APPOINTMENT_COMPLETED_REVIEW_REQUEST'
  | 'KYC_STATUS_CHANGED';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  linkUrl: string;
  createdAt: string;
}
