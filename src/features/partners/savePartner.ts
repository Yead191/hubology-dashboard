import type { PartnerFormPayload } from "@/redux/features/partners/partners.types";
import type { PartnerMutationResponse } from "@/redux/features/partners/partners.types";
import {
  buildPartnerImageFormData,
  buildPartnerJsonBody,
  type PartnerJsonBody,
} from "@/redux/features/partners/buildPartnerFormData";

type CreatePartner = (body: PartnerJsonBody) => { unwrap: () => Promise<PartnerMutationResponse> };
type UpdatePartner = (arg: {
  id: string;
  body: PartnerJsonBody | FormData;
}) => { unwrap: () => Promise<PartnerMutationResponse> };

/** Save partner fields as JSON (boolean-safe), then upload logo separately if provided. */
export async function savePartner(
  payload: PartnerFormPayload,
  mutations: {
    partnerId?: string;
    createPartner: CreatePartner;
    updatePartner: UpdatePartner;
  }
): Promise<PartnerMutationResponse> {
  const jsonBody = buildPartnerJsonBody(payload);

  if (mutations.partnerId) {
    const response = await mutations.updatePartner({
      id: mutations.partnerId,
      body: jsonBody,
    }).unwrap();

    if (payload.imageFile) {
      await mutations.updatePartner({
        id: mutations.partnerId,
        body: buildPartnerImageFormData(payload.imageFile),
      }).unwrap();
    }

    return response;
  }

  const response = await mutations.createPartner(jsonBody).unwrap();
  const createdId = response.data?._id;

  if (payload.imageFile && createdId) {
    await mutations.updatePartner({
      id: createdId,
      body: buildPartnerImageFormData(payload.imageFile),
    }).unwrap();
  }

  return response;
}
