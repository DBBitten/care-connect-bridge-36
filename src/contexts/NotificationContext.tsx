import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";
import { Notification, NotificationType } from "@/types/notification";
import { useAuth } from "@/contexts/AuthContext";
import { Appointment } from "@/types/payment";

const STORAGE_KEY = "eldercare_notifications";

function load(): Notification[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
  } catch {}
  return [];
}

function save(data: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

interface NotificationContextType {
  notifications: Notification[];
  userNotifications: Notification[];
  unreadCount: number;
  addNotification: (data: Omit<Notification, "id" | "createdAt" | "isRead">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  runReminderJob: () => number;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(load);

  const persist = useCallback((n: Notification[]) => {
    setNotifications(n);
    save(n);
  }, []);

  const addNotification = useCallback(
    (data: Omit<Notification, "id" | "createdAt" | "isRead">) => {
      setNotifications((prev) => {
        const notif: Notification = {
          ...data,
          id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        const updated = [notif, ...prev];
        save(updated);
        return updated;
      });
    },
    []
  );

  const markAsRead = useCallback(
    (id: string) => {
      setNotifications((prev) => {
        const updated = prev.map((n) => (n.id === id ? { ...n, isRead: true } : n));
        save(updated);
        return updated;
      });
    },
    []
  );

  const markAllAsRead = useCallback(() => {
    if (!user?.email) return;
    setNotifications((prev) => {
      const updated = prev.map((n) =>
        n.userId === user.email ? { ...n, isRead: true } : n
      );
      save(updated);
      return updated;
    });
  }, [user?.email]);

  const userNotifications = useMemo(
    () => (user?.email ? notifications.filter((n) => n.userId === user.email) : []),
    [notifications, user?.email]
  );

  const unreadCount = useMemo(
    () => userNotifications.filter((n) => !n.isRead).length,
    [userNotifications]
  );

  const runReminderJob = useCallback((): number => {
    let created = 0;
    try {
      const raw = localStorage.getItem("eldercare_appointments");
      if (!raw) return 0;
      const appointments: Appointment[] = JSON.parse(raw);
      const now = Date.now();
      const current = [...notifications];

      for (const appt of appointments) {
        if (appt.status !== "PAID") continue;
        const start = new Date(`${appt.dates[0]}T${appt.startTime}:00`).getTime();
        const hoursUntil = (start - now) / (1000 * 60 * 60);

        const checks: { type: NotificationType; min: number; max: number }[] = [
          { type: "APPOINTMENT_REMINDER_24H", min: 23, max: 25 },
          { type: "APPOINTMENT_REMINDER_2H", min: 1.5, max: 2.5 },
        ];

        for (const check of checks) {
          if (hoursUntil < check.min || hoursUntil > check.max) continue;
          const users = [appt.clientEmail, appt.caregiverName]; // caregiverName used as userId proxy
          for (const uid of users) {
            const exists = current.some(
              (n) => n.type === check.type && n.userId === uid && n.body.includes(appt.id)
            );
            if (exists) continue;
            const notif: Notification = {
              id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              userId: uid,
              type: check.type,
              title: check.type === "APPOINTMENT_REMINDER_24H" ? "Lembrete: atendimento em 24h" : "Lembrete: atendimento em 2h",
              body: `Seu atendimento de ${appt.serviceName} está agendado para ${appt.dates[0]} às ${appt.startTime}. (ref: ${appt.id})`,
              isRead: false,
              linkUrl: "/cliente/agenda",
              createdAt: new Date().toISOString(),
            };
            current.unshift(notif);
            created++;
          }
        }
      }

      if (created > 0) {
        persist(current);
      }
    } catch {}
    return created;
  }, [persist]);

  return (
    <NotificationContext.Provider
      value={{ notifications, userNotifications, unreadCount, addNotification, markAsRead, markAllAsRead, runReminderJob }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}
