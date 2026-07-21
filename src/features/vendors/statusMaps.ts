import type { StatusTone } from "@/types/common";
import type { VendorStatus, SubscriptionStatus } from "./types";

export const statusToneMap: Record<VendorStatus, StatusTone> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export const statusLabelMap: Record<VendorStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Rejected",
};

export const subscriptionToneMap: Record<SubscriptionStatus, StatusTone> = {
  not_subscribed: "neutral",
  active: "info",
  expired: "warning",
  cancelled: "danger",
};

export const subscriptionLabelMap: Record<SubscriptionStatus, string> = {
  not_subscribed: "Not subscribed",
  active: "Package active",
  expired: "Package expired",
  cancelled: "Package cancelled",
};
