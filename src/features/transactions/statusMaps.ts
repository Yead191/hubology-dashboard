import type { StatusTone } from "@/types/common";
import type { TransactionCategory } from "@/redux/features/transactions/transactions.types";

export const transactionStatusToneMap: Record<string, StatusTone> = {
  Success: "success",
  Failed: "danger",
  Pending: "warning",
};

export const transactionTypeToneMap: Record<string, StatusTone> = {
  Credit: "success",
  Debit: "danger",
};

export const transactionCategoryToneMap: Record<string, StatusTone> = {
  Membership: "gold",
  Shop: "violet",
  Service: "info",
};

export const transactionCategoryLabelMap: Record<TransactionCategory, string> = {
  Membership: "Membership",
  Shop: "Shop",
  Service: "Service",
};
