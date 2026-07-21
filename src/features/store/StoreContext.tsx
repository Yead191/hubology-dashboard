import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { genId } from "@/lib/utils";
import { INITIAL_DIGITAL_PRODUCTS, INITIAL_OFFICE_SUPPLIES } from "./mockData";
import type { DigitalProduct, DigitalProductInput, OfficeSupply, OfficeSupplyInput } from "./types";

interface StoreContextValue {
  digitalProducts: DigitalProduct[];
  officeSupplies: OfficeSupply[];
  addDigitalProduct: (input: DigitalProductInput) => void;
  updateDigitalProduct: (id: string, input: DigitalProductInput) => void;
  removeDigitalProduct: (id: string) => void;
  removeDigitalReview: (productId: string, reviewId: string) => void;
  addOfficeSupply: (input: OfficeSupplyInput) => void;
  updateOfficeSupply: (id: string, input: OfficeSupplyInput) => void;
  removeOfficeSupply: (id: string) => void;
  removeOfficeReview: (productId: string, reviewId: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

function recalcRating(reviews: { rating: number }[]) {
  const totalReviews = reviews.length;
  const average = totalReviews === 0 ? 0 : Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10;
  return { average, totalReviews };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [digitalProducts, setDigitalProducts] = useState<DigitalProduct[]>(INITIAL_DIGITAL_PRODUCTS);
  const [officeSupplies, setOfficeSupplies] = useState<OfficeSupply[]>(INITIAL_OFFICE_SUPPLIES);

  const addDigitalProduct = (input: DigitalProductInput) => {
    const now = new Date().toISOString();
    setDigitalProducts((prev) => [
      { ...input, id: genId("book"), rating: { average: 0, totalReviews: 0, reviews: [] }, createdAt: now, updatedAt: now },
      ...prev,
    ]);
  };

  const updateDigitalProduct = (id: string, input: DigitalProductInput) => {
    const now = new Date().toISOString();
    setDigitalProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...input, updatedAt: now } : p)));
  };

  const removeDigitalProduct = (id: string) => {
    setDigitalProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const removeDigitalReview = (productId: string, reviewId: string) => {
    setDigitalProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const reviews = p.rating.reviews.filter((r) => r.id !== reviewId);
        return { ...p, rating: { ...recalcRating(reviews), reviews } };
      })
    );
  };

  const addOfficeSupply = (input: OfficeSupplyInput) => {
    const now = new Date().toISOString();
    setOfficeSupplies((prev) => [
      { ...input, id: genId("tangible"), rating: { average: 0, totalReviews: 0, reviews: [] }, createdAt: now, updatedAt: now },
      ...prev,
    ]);
  };

  const updateOfficeSupply = (id: string, input: OfficeSupplyInput) => {
    const now = new Date().toISOString();
    setOfficeSupplies((prev) => prev.map((p) => (p.id === id ? { ...p, ...input, updatedAt: now } : p)));
  };

  const removeOfficeSupply = (id: string) => {
    setOfficeSupplies((prev) => prev.filter((p) => p.id !== id));
  };

  const removeOfficeReview = (productId: string, reviewId: string) => {
    setOfficeSupplies((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const reviews = p.rating.reviews.filter((r) => r.id !== reviewId);
        return { ...p, rating: { ...recalcRating(reviews), reviews } };
      })
    );
  };

  const value = useMemo(
    () => ({
      digitalProducts,
      officeSupplies,
      addDigitalProduct,
      updateDigitalProduct,
      removeDigitalProduct,
      removeDigitalReview,
      addOfficeSupply,
      updateOfficeSupply,
      removeOfficeSupply,
      removeOfficeReview,
    }),
    [digitalProducts, officeSupplies]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
