export interface MembershipPlan {
  id: string;
  name: string;
  tagline: string;
  priceMonthly: number;
  priceYearly: number;
  featured: boolean;
  highlight: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export type MembershipPlanInput = Omit<MembershipPlan, "id" | "createdAt" | "updatedAt">;
