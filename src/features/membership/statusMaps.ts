import type { StatusTone } from "@/types/common";
import type { MembershipRecurring, MembershipType } from "@/redux/features/membership/membership.types";

export const membershipTypeLabelMap: Record<MembershipType, string> = {
  user: "User",
  vendor: "Vendor",
};

export const recurringLabelMap: Record<MembershipRecurring, string> = {
  month: "Monthly",
  year: "Yearly",
};

export const subscriberStatusToneMap: Record<string, StatusTone> = {
  active: "success",
  expired: "warning",
  cancelled: "danger",
  pending: "info",
};
