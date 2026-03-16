import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  Appointment, AppointmentStatus, Payment, PaymentStatus, Refund, PlatformSettings, PaymentMethod,
} from "@/types/payment";
import { useNotifications } from "@/contexts/NotificationContext";

const KEYS = {
  appointments: "eldercare_appointments",
  payments: "eldercare_payments",
  refunds: "eldercare_refunds",
  settings: "eldercare_platform_settings",
};

const defaultSettings: PlatformSettings = {
  id: "settings-1",
  platformFeeRate: 0.18,
  currency: "BRL",
  updatedAt: new Date().toISOString(),
};

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const s = localStorage.getItem(key);
    if (s) return JSON.parse(s);
  } catch {}
  return fallback;
}

function loadSettings(): PlatformSettings {
  try {
    const s = localStorage.getItem(KEYS.settings);
    if (s) return JSON.parse(s);
  } catch {}
  return defaultSettings;
}

function save(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

function calcHours(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  return (eh + em / 60) - (sh + sm / 60);
}

function calcRefundRate(hoursUntil: number): number {
  return hoursUntil > 24 ? 1 : 0.5;
}

interface CreateAppointmentData {
  clientEmail: string;
  caregiverName: string;
  serviceId: string;
  serviceName: string;
  dates: string[];
  startTime: string;
  endTime: string;
  pricePerHour: number;
  address?: string;
}

interface PaymentContextType {
  appointments: Appointment[];
  payments: Payment[];
  refunds: Refund[];
  settings: PlatformSettings;
  createAppointment: (data: CreateAppointmentData) => Appointment;
  getAppointmentById: (id: string) => Appointment | undefined;
  getAppointmentsByClient: (email: string) => Appointment[];
  processPayment: (appointmentId: string) => Payment;
  cancelAppointment: (appointmentId: string) => void;
  adminRefund: (paymentId: string, reason: string) => void;
  getPayments: () => Payment[];
  getPaymentByAppointment: (appointmentId: string) => Payment | undefined;
  getRefunds: () => Refund[];
  updatePlatformFeeRate: (rate: number) => void;
}

const PaymentContext = createContext<PaymentContextType | null>(null);

export function PaymentProvider({ children }: { children: ReactNode }) {
  const { addNotification } = useNotifications();
  const [appointments, setAppointments] = useState<Appointment[]>(() => load(KEYS.appointments, []));
  const [payments, setPayments] = useState<Payment[]>(() => load(KEYS.payments, []));
  const [refunds, setRefunds] = useState<Refund[]>(() => load(KEYS.refunds, []));
  const [settings, setSettings] = useState<PlatformSettings>(loadSettings);

  const persistAppointments = useCallback((a: Appointment[]) => { setAppointments(a); save(KEYS.appointments, a); }, []);
  const persistPayments = useCallback((p: Payment[]) => { setPayments(p); save(KEYS.payments, p); }, []);
  const persistRefunds = useCallback((r: Refund[]) => { setRefunds(r); save(KEYS.refunds, r); }, []);
  const persistSettings = useCallback((s: PlatformSettings) => { setSettings(s); save(KEYS.settings, s); }, []);

  const createAppointment = useCallback((data: CreateAppointmentData): Appointment => {
    const hours = calcHours(data.startTime, data.endTime);
    const totalPrice = data.dates.length * hours * data.pricePerHour;
    const platformFee = Math.round(totalPrice * settings.platformFeeRate * 100) / 100;
    const caregiverPayout = Math.round((totalPrice - platformFee) * 100) / 100;
    const appt: Appointment = {
      ...data,
      id: `appt-${Date.now()}`,
      totalPrice,
      platformFee,
      caregiverPayout,
      status: "PAYMENT_PENDING",
      createdAt: new Date().toISOString(),
    };
    const updated = [...appointments, appt];
    persistAppointments(updated);
    addNotification({ userId: data.clientEmail, type: "PAYMENT_PENDING", title: "Agendamento criado", body: `Seu agendamento com ${data.caregiverName} (${data.startTime}–${data.endTime}) está aguardando pagamento.`, linkUrl: `/checkout/${appt.id}` });
    addNotification({ userId: data.caregiverName, type: "APPOINTMENT_REQUESTED", title: "Novo agendamento", body: `Você tem um novo agendamento de ${data.clientEmail} para ${data.dates.length} dia(s) (${data.startTime}–${data.endTime}).`, linkUrl: "/cuidador/dashboard" });
    return appt;
  }, [appointments, settings.platformFeeRate, persistAppointments, addNotification]);

  const getAppointmentById = useCallback((id: string) => appointments.find(a => a.id === id), [appointments]);
  const getAppointmentsByClient = useCallback((email: string) => appointments.filter(a => a.clientEmail === email), [appointments]);

  const processPayment = useCallback((appointmentId: string): Payment => {
    const appt = appointments.find(a => a.id === appointmentId);
    if (!appt) throw new Error("Appointment not found");
    const now = new Date().toISOString();
    const payment: Payment = {
      id: `pay-${Date.now()}`,
      appointmentId,
      status: "PAID",
      amountTotal: appt.totalPrice,
      platformFee: appt.platformFee,
      caregiverPayout: appt.caregiverPayout,
      method: "SIMULATED",
      createdAt: now,
      paidAt: now,
    };
    persistPayments([...payments, payment]);
    persistAppointments(appointments.map(a => a.id === appointmentId ? { ...a, status: "PAID" as AppointmentStatus } : a));
    addNotification({ userId: appt.clientEmail, type: "PAYMENT_CONFIRMED", title: "Pagamento confirmado", body: `Seu pagamento de R$ ${appt.totalPrice.toFixed(2)} foi confirmado.`, linkUrl: "/cliente/pagamentos" });
    addNotification({ userId: appt.caregiverName, type: "APPOINTMENT_CONFIRMED", title: "Atendimento confirmado", body: `O atendimento de ${appt.dates.length} dia(s) às ${appt.startTime} foi confirmado.`, linkUrl: "/cuidador/dashboard" });
    return payment;
  }, [appointments, payments, persistAppointments, persistPayments, addNotification]);

  const cancelAppointment = useCallback((appointmentId: string) => {
    const appt = appointments.find(a => a.id === appointmentId);
    if (!appt) return;

    if (appt.status !== "PAID") {
      persistAppointments(appointments.map(a => a.id === appointmentId ? { ...a, status: "CANCELED" as AppointmentStatus } : a));
      return;
    }

    const apptDate = new Date(`${appt.dates[0]}T${appt.startTime}:00`);
    const hoursUntil = (apptDate.getTime() - Date.now()) / (1000 * 60 * 60);
    const refundRate = calcRefundRate(hoursUntil);
    const refundAmount = Math.round(appt.totalPrice * refundRate * 100) / 100;

    const now = new Date().toISOString();
    const existingPayment = payments.find(p => p.appointmentId === appointmentId && p.status === "PAID");
    if (existingPayment) {
      persistPayments(payments.map(p => p.id === existingPayment.id ? { ...p, status: "REFUNDED" as PaymentStatus, refundedAt: now } : p));
      const refund: Refund = {
        id: `ref-${Date.now()}`,
        paymentId: existingPayment.id,
        amount: refundAmount,
        reason: hoursUntil > 24 ? "Cancelamento com mais de 24h — reembolso integral" : "Cancelamento com menos de 24h — reembolso parcial (50%)",
        createdAt: now,
        createdBy: appt.clientEmail,
      };
      persistRefunds([...refunds, refund]);
    }
    persistAppointments(appointments.map(a => a.id === appointmentId ? { ...a, status: "CANCELED" as AppointmentStatus } : a));
    addNotification({ userId: appt.clientEmail, type: "APPOINTMENT_CANCELED", title: "Agendamento cancelado", body: `Seu agendamento de ${appt.dates.length} dia(s) foi cancelado.`, linkUrl: "/cliente/pagamentos" });
    addNotification({ userId: appt.caregiverName, type: "APPOINTMENT_CANCELED", title: "Atendimento cancelado", body: `O atendimento de ${appt.dates.length} dia(s) foi cancelado.`, linkUrl: "/cuidador/dashboard" });
  }, [appointments, payments, refunds, persistAppointments, persistPayments, persistRefunds, addNotification]);

  const adminRefund = useCallback((paymentId: string, reason: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;
    const now = new Date().toISOString();
    persistPayments(payments.map(p => p.id === paymentId ? { ...p, status: "REFUNDED" as PaymentStatus, refundedAt: now } : p));
    const refund: Refund = {
      id: `ref-${Date.now()}`,
      paymentId,
      amount: payment.amountTotal,
      reason,
      createdAt: now,
      createdBy: "admin@curami.com.br",
    };
    persistRefunds([...refunds, refund]);
    persistAppointments(appointments.map(a => a.id === payment.appointmentId ? { ...a, status: "CANCELED" as AppointmentStatus } : a));
  }, [appointments, payments, refunds, persistAppointments, persistPayments, persistRefunds]);

  const getPayments = useCallback(() => payments, [payments]);
  const getPaymentByAppointment = useCallback((aid: string) => payments.find(p => p.appointmentId === aid), [payments]);

  const updatePlatformFeeRate = useCallback((rate: number) => {
    const updated = { ...settings, platformFeeRate: rate, updatedAt: new Date().toISOString() };
    persistSettings(updated);
  }, [settings, persistSettings]);

  return (
    <PaymentContext.Provider value={{
      appointments, payments, refunds, settings,
      createAppointment, getAppointmentById, getAppointmentsByClient,
      processPayment, cancelAppointment, adminRefund,
      getPayments,
      getPaymentByAppointment,
      getRefunds: () => refunds,
      updatePlatformFeeRate,
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayments must be used within PaymentProvider");
  return ctx;
}
