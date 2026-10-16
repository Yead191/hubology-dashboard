/** Match backend enum spelling exactly (including "Deliverd"). */
export type OrderStatus = "Pending" | "Processing" | "Deliverd" | "Cancelled";

export type OrderPaymentStatus = "paid" | "unpaid" | "pending" | "refunded" | string;

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export interface OrderItem {
  title: string;
  image: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderPriceBreakdown {
  products_price: number;
  serviceFee: number;
  delivery_charge: number;
  discount_amount: number;
  total_price: number;
  tax: number;
  subtotal: number;
}

export interface OrderAddressBreakdown {
  street_address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  contact_number?: string;
  [key: string]: unknown;
}

export interface OrderRefundSummary {
  _id?: string;
  refundAmount?: number;
  refundType?: string;
  status?: string;
  stripeRefundId?: string;
  adminNote?: string;
  reason?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiOrder {
  _id: string;
  user: OrderUser;
  items: OrderItem[];
  status: OrderStatus;
  payment_status: OrderPaymentStatus;
  payment_intent_id?: string | null;
  transaction_id?: string | null;
  contact_number?: string | null;
  formatted_address?: string | null;
  address_breakdown?: OrderAddressBreakdown;
  coupon?: string | null;
  total_items?: number;
  discount_percentage?: number;
  discount_amount?: number;
  order_id: string;
  price_breakdown: OrderPriceBreakdown;
  refund?: OrderRefundSummary | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderSingleResponse {
  success: boolean;
  message: string;
  data: ApiOrder;
}

export interface PaginationMeta {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: OrderStatus | "";
  payment_status?: OrderPaymentStatus | "";
  startDate?: string;
  endDate?: string;
}

export interface OrdersListResponse {
  success: boolean;
  message: string;
  pagination: PaginationMeta;
  data: ApiOrder[];
}

export interface OrderMutationResponse {
  success: boolean;
  message: string;
  data?: ApiOrder;
}

export const ORDER_STATUS_OPTIONS: OrderStatus[] = [
  "Pending",
  "Processing",
  "Deliverd",
  "Cancelled",
];

export const ORDER_PAYMENT_STATUS_OPTIONS = ["paid", "unpaid", "pending", "refunded"] as const;
