import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { genId } from "@/lib/utils";
import { INITIAL_VENDORS } from "./mockData";
import type { Vendor, VendorInput, SubscriptionStatus } from "./types";

interface VendorsContextValue {
  vendors: Vendor[];
  addVendor: (input: VendorInput) => void;
  updateVendor: (id: string, input: VendorInput) => void;
  removeVendor: (id: string) => void;
  approveVendor: (id: string) => void;
  rejectVendor: (id: string, reason: string) => void;
  setSubscription: (id: string, subscription: SubscriptionStatus) => void;
}

const VendorsContext = createContext<VendorsContextValue | undefined>(undefined);

export function VendorsProvider({ children }: { children: ReactNode }) {
  const [vendors, setVendors] = useState<Vendor[]>(INITIAL_VENDORS);

  const addVendor = (input: VendorInput) => {
    const now = new Date().toISOString();
    setVendors((prev) => [
      {
        ...input,
        id: genId("v"),
        status: "approved",
        subscription: "not_subscribed",
        appliedAt: now,
        reviewedAt: now,
        rejectionReason: null,
      },
      ...prev,
    ]);
  };

  const updateVendor = (id: string, input: VendorInput) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, ...input } : v)));
  };

  const removeVendor = (id: string) => {
    setVendors((prev) => prev.filter((v) => v.id !== id));
  };

  const approveVendor = (id: string) => {
    const now = new Date().toISOString();
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "approved", reviewedAt: now, rejectionReason: null } : v))
    );
  };

  const rejectVendor = (id: string, reason: string) => {
    const now = new Date().toISOString();
    setVendors((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "rejected", reviewedAt: now, rejectionReason: reason } : v))
    );
  };

  const setSubscription = (id: string, subscription: SubscriptionStatus) => {
    setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, subscription } : v)));
  };

  const value = useMemo(
    () => ({ vendors, addVendor, updateVendor, removeVendor, approveVendor, rejectVendor, setSubscription }),
    [vendors]
  );

  return <VendorsContext.Provider value={value}>{children}</VendorsContext.Provider>;
}

export function useVendors() {
  const ctx = useContext(VendorsContext);
  if (!ctx) throw new Error("useVendors must be used within VendorsProvider");
  return ctx;
}
