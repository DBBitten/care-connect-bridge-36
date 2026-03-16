import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Service } from "@/types/service";
import { seedServices } from "@/data/serviceSeed";

const STORAGE_KEY = "eldercare_services";

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
