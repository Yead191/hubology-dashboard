import type { PartnerFormPayload } from "./partners.types";

export type PartnerJsonBody = {
  name: string;
  description: string;
  website: string;
  contactEmail: string;
  contactPhone: string;
  status: PartnerFormPayload["status"];
  featured: boolean;
  offers: string[];
  user?: string;
};

/** JSON payload — keeps booleans as real booleans for API validation. */
export function buildPartnerJsonBody(payload: PartnerFormPayload): PartnerJsonBody {
  return {
    name: payload.name.trim(),
    description: payload.description.trim(),
    website: payload.website.trim(),
    contactEmail: payload.contactEmail.trim(),
    contactPhone: payload.contactPhone.trim(),
    status: payload.status,
    featured: payload.featured,
    offers: payload.offers.map((o) => o.trim()).filter(Boolean),
    ...(payload.userId ? { user: payload.userId } : {}),
  };
}

/** Multipart body with only the logo file (used after JSON create/update). */
export function buildPartnerImageFormData(imageFile: File): FormData {
  const formData = new FormData();
  formData.append("image", imageFile);
  return formData;
}
