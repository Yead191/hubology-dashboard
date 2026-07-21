export interface ProductReview {
  id: string;
  reviewerName: string;
  rating: number;
  date: string;
  text: string;
}

export interface ProductRating {
  average: number;
  totalReviews: number;
  reviews: ProductReview[];
}

export interface DigitalProductDetails {
  publisher: string;
  firstPublish: string;
  edition: string;
  pages: number;
}

export interface DigitalProduct {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  description: string;
  coverImage: string;
  accent: [string, string];
  fileUrl: string;
  details: DigitalProductDetails;
  rating: ProductRating;
  createdAt: string;
  updatedAt: string;
}

export interface OfficeSupplyDetails {
  material: string;
  dimensions: string;
  weight: string;
  inStock: boolean;
}

export interface OfficeSupply {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  price: number;
  description: string;
  coverImage: string;
  details: OfficeSupplyDetails;
  rating: ProductRating;
  createdAt: string;
  updatedAt: string;
}

export type DigitalProductInput = Omit<DigitalProduct, "id" | "rating" | "createdAt" | "updatedAt">;
export type OfficeSupplyInput = Omit<OfficeSupply, "id" | "rating" | "createdAt" | "updatedAt">;
