import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { genId } from "@/lib/utils";
import { INITIAL_MEMBERSHIP_PLANS } from "./mockData";
import type { MembershipPlan, MembershipPlanInput } from "./types";

interface MembershipContextValue {
  plans: MembershipPlan[];
  addPlan: (input: MembershipPlanInput) => void;
  updatePlan: (id: string, input: MembershipPlanInput) => void;
  removePlan: (id: string) => void;
}

const MembershipContext = createContext<MembershipContextValue | undefined>(undefined);

export function MembershipProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<MembershipPlan[]>(INITIAL_MEMBERSHIP_PLANS);

  const addPlan = (input: MembershipPlanInput) => {
    const now = new Date().toISOString();
    setPlans((prev) => [...prev, { ...input, id: genId("plan"), createdAt: now, updatedAt: now }]);
  };

  const updatePlan = (id: string, input: MembershipPlanInput) => {
    const now = new Date().toISOString();
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...input, updatedAt: now } : p)));
  };

  const removePlan = (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const value = useMemo(() => ({ plans, addPlan, updatePlan, removePlan }), [plans]);

  return <MembershipContext.Provider value={value}>{children}</MembershipContext.Provider>;
}

export function useMembership() {
  const ctx = useContext(MembershipContext);
  if (!ctx) throw new Error("useMembership must be used within MembershipProvider");
  return ctx;
}
