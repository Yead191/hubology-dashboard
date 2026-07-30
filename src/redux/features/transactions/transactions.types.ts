export type TransactionCategory = "Membership" | "Shop" | "Service";
export type TransactionStatus = "Success" | "Failed" | "Pending" | string;
export type TransactionType = "Credit" | "Debit" | string;

export interface TransactionUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export interface ApiTransaction {
  _id: string;
  user: TransactionUser;
  total_price: number;
  payment_received: number;
  order?: string | null;
  platform_fee: number;
  status: TransactionStatus;
  type: TransactionType;
  category: TransactionCategory | string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface GetTransactionsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export interface TransactionsListResponse {
  success: boolean;
  message: string;
  pagination: PaginationMeta;
  data: ApiTransaction[];
}

export const TRANSACTION_CATEGORY_OPTIONS: TransactionCategory[] = [
  "Membership",
  "Shop",
  "Service",
];
