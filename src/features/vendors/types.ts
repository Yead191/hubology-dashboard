export type VendorStatus = "pending" | "approved" | "rejected";
export type SubscriptionStatus = "not_subscribed" | "active" | "expired" | "cancelled";

export interface VendorContact {
  email: string;
  phone: string;
}

export interface Vendor {
  id: string;
  profile: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  about: string;
  expertise: string[];
  yearsExperience: string;
  degree: string;
  linkedin: string;
  hourlyRate: string;
  availability: string;
  consultationTypes: string[];
  location: string;
  contact: VendorContact;
  status: VendorStatus;
  subscription: SubscriptionStatus;
  appliedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export type VendorInput = Omit<Vendor, "id" | "status" | "subscription" | "appliedAt" | "reviewedAt" | "rejectionReason">;

export const YEARS_EXPERIENCE_OPTIONS = ["0 - 2 years", "3 - 5 years", "6 - 10 years", "11 - 15 years", "15+ years"];
export const AVAILABILITY_OPTIONS = ["Full-time (40+ hrs/week)", "Part-time (10-30 hrs/week)", "Advisory (limited hours)"];
export const CONSULTATION_TYPE_OPTIONS = ["1-on-1 Calls", "Document Review", "Group Workshops", "Async Chat Support"];
