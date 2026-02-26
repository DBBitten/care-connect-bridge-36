import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Service } from "@/types/service";

const STORAGE_KEY = "eldercare_services";

const seedServices: Service[] = [
  {
    id: "svc-1",
    name: "Companhia e supervisão",
    description: "Acompanhamento presencial com supervisão contínua, conversas e atividades leves para o bem-estar do idoso.",
    baseDurationMinutes: 120,
    allowedDurationsMinutes: [120, 240, 480],
    pricePerHour: 35,
    minHours: 2,
    maxHours: 12,
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "svc-2",
    name: "Apoio em mobilidade leve",
    description: "Auxílio em deslocamentos internos, transferências e caminhadas assistidas com segurança.",
    baseDurationMinutes: 120,
    allowedDurationsMinutes: [120, 240],
    pricePerHour: 40,
    minHours: 2,
    maxHours: 12,
    requiresCertificationTag: "BASIC_MOBILITY",
    isActive: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "svc-3",
    name: "Apoio em alimentação/hidratação",
    description: "Preparo e auxílio na alimentação e hidratação, garantindo nutrição adequada e segura.",
    baseDurationMinutes: 120,
    allowedDurationsMinutes: [120, 240],
    pricePerHour: 38,
    minHours: 2,
    maxHours: 12,
    isActive: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "svc-4",
    name: "Higiene não invasiva",
    description: "Auxílio em higiene pessoal básica, como banho assistido e troca de roupas, com respeito e dignidade.",
    baseDurationMinutes: 120,
    allowedDurationsMinutes: [120, 240],
    pricePerHour: 42,
    minHours: 2,
    maxHours: 12,
    isActive: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "svc-5",
    name: "Acompanhamento em consulta (logística)",
    description: "Acompanhamento em consultas médicas, exames e procedimentos, incluindo transporte e suporte logístico.",
    baseDurationMinutes: 120,
    allowedDurationsMinutes: [120, 240, 480],
    pricePerHour: 45,
    minHours: 2,
    maxHours: 12,
    isActive: true,
    sortOrder: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function loadServices(): Service[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return seedServices;
}

function saveServices(services: Service[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
}

interface ServiceContextType {
  services: Service[];
  getActiveServices: () => Service[];
  getServiceById: (id: string) => Service | undefined;
  createService: (data: Omit<Service, "id" | "createdAt" | "updatedAt">) => Service;
  updateService: (id: string, data: Partial<Service>) => void;
  toggleActive: (id: string) => void;
  reorder: (id: string, newSortOrder: number) => void;
}

const ServiceContext = createContext<ServiceContextType | null>(null);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(loadServices);

  const persist = useCallback((updated: Service[]) => {
    setServices(updated);
    saveServices(updated);
  }, []);

  const getActiveServices = useCallback(() => {
    return services.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [services]);

  const getServiceById = useCallback((id: string) => services.find((s) => s.id === id), [services]);

  const createService = useCallback(
    (data: Omit<Service, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const svc: Service = { ...data, id: `svc-${Date.now()}`, createdAt: now, updatedAt: now };
      persist([...services, svc]);
      return svc;
    },
    [services, persist]
  );

  const updateService = useCallback(
    (id: string, data: Partial<Service>) => {
      persist(services.map((s) => (s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s)));
    },
    [services, persist]
  );

  const toggleActive = useCallback(
    (id: string) => {
      persist(services.map((s) => (s.id === id ? { ...s, isActive: !s.isActive, updatedAt: new Date().toISOString() } : s)));
    },
    [services, persist]
  );

  const reorder = useCallback(
    (id: string, newSortOrder: number) => {
      persist(services.map((s) => (s.id === id ? { ...s, sortOrder: newSortOrder, updatedAt: new Date().toISOString() } : s)));
    },
    [services, persist]
  );

  return (
    <ServiceContext.Provider value={{ services, getActiveServices, getServiceById, createService, updateService, toggleActive, reorder }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServiceContext);
  if (!ctx) throw new Error("useServices must be used within ServiceProvider");
  return ctx;
}
