export interface ServicePrice {
  currency: string;
  amount: number;
  frequency: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  price: ServicePrice;
  features: string[];
  featured: boolean;
  longDescription: string;
  image: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type ServiceInput = Omit<Service, "id" | "createdAt" | "updatedAt">;
