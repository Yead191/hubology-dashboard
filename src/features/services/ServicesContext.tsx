import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { genId } from "@/lib/utils";
import { INITIAL_SERVICES } from "./mockData";
import type { Service, ServiceInput } from "./types";

interface ServicesContextValue {
  services: Service[];
  addService: (input: ServiceInput) => void;
  updateService: (id: string, input: ServiceInput) => void;
  removeService: (id: string) => void;
}

const ServicesContext = createContext<ServicesContextValue | undefined>(undefined);

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);

  const addService = (input: ServiceInput) => {
    const now = new Date().toISOString();
    setServices((prev) => [{ ...input, id: genId("svc"), createdAt: now, updatedAt: now }, ...prev]);
  };

  const updateService = (id: string, input: ServiceInput) => {
    const now = new Date().toISOString();
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...input, updatedAt: now } : s)));
  };

  const removeService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const value = useMemo(
    () => ({ services, addService, updateService, removeService }),
    [services]
  );

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
}

export function useServices() {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error("useServices must be used within ServicesProvider");
  return ctx;
}
