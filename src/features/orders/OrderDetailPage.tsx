import { useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Skeleton, Tooltip } from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CopyOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  PrinterOutlined,
  ReloadOutlined,
  ShoppingOutlined,
  TagOutlined,
  UserOutlined,
  CreditCardOutlined,
  ClockCircleOutlined,
  RollbackOutlined,
  SafetyCertificateOutlined,
  CheckCircleFilled,
  SyncOutlined,
  CloseCircleFilled,
} from "@ant-design/icons";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusTag } from "@/components/ui/StatusTag";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { cn, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} from "@/redux/features/orders/ordersApi";
import type { ApiOrder, OrderStatus } from "@/redux/features/orders/orders.types";
import {
  orderStatusLabelMap,
  orderStatusToneMap,
  paymentLabel,
  paymentStatusToneMap,
} from "./statusMaps";
import { OrderStatusSelect } from "./components/OrderStatusSelect";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const err = error as { data?: { message?: string }; message?: string };
    return err.data?.message ?? err.message ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

function SectionTitle({ icon, title, badge }: { icon: ReactNode; title: string; badge?: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-navy-700/60 pb-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mist-400">
        <span className="text-violet-glow text-sm">{icon}</span>
        <span>{title}</span>
      </div>
      {badge}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: ReactNode;
  accent?: "success" | "danger" | "warning";
}) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5 border-b border-navy-800/40 last:border-b-0">
      <span className="text-mist-400">{label}</span>
      <span
        className={cn(
          "font-medium",
          accent === "success" && "text-success",
          accent === "danger" && "text-danger",
          accent === "warning" && "text-warning",
          !accent && "text-cloud-100",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function OrderDetailPage() {
  const { orderId = "" } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const {
    data: orderRes,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetOrderByIdQuery(orderId, { skip: !orderId });

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [deleteOrder] = useDeleteOrderMutation();

  const order = orderRes?.data;

  const copyToClipboard = (text: string, key: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleStatusChange = (newStatus: OrderStatus) => {
    if (!order) return;
    const promise = updateStatus({ id: order._id, status: newStatus }).unwrap();
    toast.promise(promise, {
      loading: `Updating order #${order.order_id} status…`,
      success: `Order #${order.order_id} is now ${orderStatusLabelMap[newStatus]}.`,
      error: (err) => getErrorMessage(err),
    });
  };

  const deleteFlow = useConfirmDelete<ApiOrder>(async (record) => {
    const promise = deleteOrder(record._id)
      .unwrap()
      .then(() => {
        navigate("/store/orders");
      });

    toast.promise(promise, {
      loading: `Deleting order #${record.order_id}…`,
      success: `Order #${record.order_id} has been permanently deleted.`,
      error: (err) => getErrorMessage(err),
    });

    await promise.catch(() => undefined);
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/store/orders")}
            className="text-mist-400 hover:text-cloud-100"
          >
            Back to orders
          </Button>
        </div>

        <GlassCard className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Skeleton.Avatar active size={64} shape="square" className="rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton.Input active size="large" style={{ width: 280 }} />
              <Skeleton.Input active size="small" style={{ width: 180 }} />
              <div className="flex gap-2 pt-2">
                <Skeleton.Button active size="small" style={{ width: 100 }} />
                <Skeleton.Button active size="small" style={{ width: 100 }} />
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <GlassCard className="p-6">
              <Skeleton active paragraph={{ rows: 6 }} />
            </GlassCard>
          </div>
          <div className="space-y-6">
            <GlassCard className="p-6">
              <Skeleton active paragraph={{ rows: 5 }} />
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div>
        <Link
          to="/store/orders"
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-mist-400 transition hover:text-violet-glow"
        >
          <ArrowLeftOutlined />
          Back to orders
        </Link>
        <GlassCard flat>
          <EmptyState
            icon={<ShoppingOutlined />}
            title="Order not found"
            description="This order may have been removed, or the link is invalid or expired."
            actionLabel="Return to orders"
            onAction={() => navigate("/store/orders")}
          />
        </GlassCard>
      </div>
    );
  }

  const breakdown = order.price_breakdown ?? {
    products_price: 0,
    serviceFee: 0,
    delivery_charge: 0,
    discount_amount: 0,
    total_price: 0,
    tax: 0,
    subtotal: 0,
  };

  const itemCount = order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) ?? order.total_items ?? 0;
  const isCancelled = order.status === "Cancelled";

  const shippingAddress =
    order.formatted_address ||
    [
      order.address_breakdown?.street_address,
      order.address_breakdown?.city,
      order.address_breakdown?.postal_code,
      order.address_breakdown?.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    null;

  const contactNumber = order.contact_number || order.address_breakdown?.contact_number;

  // Fulfillment steps timeline calculation
  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: "Pending", label: "Placed", desc: "Awaiting fulfillment" },
    { key: "Processing", label: "Processing", desc: "Order being prepared" },
    { key: "Deliverd", label: "Delivered", desc: "Completed & fulfilled" },
  ];

  const currentStepIndex =
    order.status === "Pending"
      ? 0
      : order.status === "Processing"
      ? 1
      : order.status === "Deliverd"
      ? 2
      : -1;

  return (
    <div className="space-y-6 pb-12">
      {/* Top back navigation & quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/store/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-mist-400 transition hover:text-violet-glow"
        >
          <ArrowLeftOutlined />
          <span>Back to orders</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            type="default"
            icon={<ReloadOutlined className={cn(isFetching && "animate-spin")} />}
            onClick={() => refetch()}
            loading={isFetching}
            className="border-navy-700/80 bg-navy-800/60 text-mist-300 hover:text-cloud-100"
          >
            Refresh
          </Button>

          <Button
            type="default"
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
            className="border-navy-700/80 bg-navy-800/60 text-mist-300 hover:text-cloud-100"
          >
            Print
          </Button>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteFlow.request(order)}
            className="border-danger/30! bg-danger/10! text-danger hover:bg-danger/20!"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Hero Header Glass Panel */}
      <div className="aurora-field glass-panel relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-600/20 blur-[80px]" />
        <div className="pointer-events-none absolute -left-12 -bottom-20 h-56 w-56 rounded-full bg-warning/10 blur-[80px]" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#8131F0] via-[#6322c7] to-[#391275] shadow-[0_12px_28px_-8px_rgba(129,49,240,0.65)] ring-1 ring-white/20">
              <ShoppingOutlined className="text-2xl text-white" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-cloud-100">
                  Order #{order.order_id}
                </h1>
                <StatusTag tone={orderStatusToneMap[order.status]}>
                  {orderStatusLabelMap[order.status]}
                </StatusTag>
                <StatusTag tone={paymentStatusToneMap[order.payment_status] ?? "neutral"}>
                  {paymentLabel(order.payment_status)}
                </StatusTag>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mist-400">
                <span className="inline-flex items-center gap-1.5">
                  <ClockCircleOutlined className="text-violet-glow" />
                  Placed {order.createdAt ? formatDateTime(order.createdAt) : "Recently"}
                </span>
                <span>•</span>
                <span>
                  {itemCount} item{itemCount === 1 ? "" : "s"}
                </span>
                {order.coupon && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1 text-warning">
                      <TagOutlined /> Coupon: {order.coupon}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick status change picker */}
          <div className="flex flex-col gap-2 rounded-2xl border border-navy-700/70 bg-navy-900/60 p-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-mist-500">
                Fulfillment status
              </div>
              <div className="text-xs text-mist-400">Update live order progress</div>
            </div>
            <div className="sm:ml-4">
              <OrderStatusSelect
                value={order.status}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus}
                size="middle"
              />
            </div>
          </div>
        </div>

        {/* Visual Progress Stepper */}
        {!isCancelled ? (
          <div className="relative mt-8 border-t border-navy-700/60 pt-6">
            <div className="grid grid-cols-3 gap-2">
              {steps.map((step, idx) => {
                const isCompleted = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step.key} className="relative">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-all",
                          isCompleted
                            ? "bg-violet-glow text-white shadow-[0_0_12px_rgba(129,49,240,0.5)]"
                            : "bg-navy-800 border border-navy-700 text-mist-500",
                        )}
                      >
                        {isCompleted ? <CheckCircleFilled /> : idx + 1}
                      </div>
                      <div className="min-w-0">
                        <div
                          className={cn(
                            "text-sm font-semibold truncate",
                            isCurrent
                              ? "text-violet-glow"
                              : isCompleted
                              ? "text-cloud-100"
                              : "text-mist-500",
                          )}
                        >
                          {step.label}
                        </div>
                        <div className="hidden sm:block text-xs text-mist-500 truncate">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative mt-6 flex items-center gap-3 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <CloseCircleFilled className="text-lg" />
            <div>
              <span className="font-semibold">Order Cancelled:</span> This order was marked as cancelled and is no longer moving through the fulfillment pipeline.
            </div>
          </div>
        )}
      </div>

      {/* Main 2-column detailed breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_1fr]">
        {/* Left Column: Order Line Items & Payment Breakdown */}
        <div className="space-y-6">
          {/* Purchased Line Items */}
          <GlassCard className="p-6">
            <SectionTitle
              icon={<ShoppingOutlined />}
              title={`Items in order (${order.items?.length ?? 0})`}
              badge={
                <span className="text-xs text-mist-400">
                  Total items: <span className="font-semibold text-cloud-100">{itemCount}</span>
                </span>
              }
            />

            <div className="mt-4 divide-y divide-navy-700/60">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex items-center gap-4 py-4 first:pt-1 last:pb-1"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-navy-700/80 bg-navy-900 shadow-sm">
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://placehold.co/128x128/1d2144/9ca3c9?text=Item";
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-navy-800 text-mist-500">
                          <ShoppingOutlined />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-cloud-100 text-base">{item.title}</div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-mist-400">
                        <span>
                          Unit price: <span className="text-cloud-200 font-medium">{formatCurrency(item.unit_price)}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center gap-1 rounded-md bg-navy-800 px-2 py-0.5 font-medium text-cloud-200">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-display font-semibold text-cloud-100 text-base">
                        {formatCurrency(item.total_price || item.unit_price * item.quantity)}
                      </div>
                      <div className="text-xs text-mist-500">
                        {formatCurrency(item.unit_price)} each
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-mist-400">
                  No line items found for this order.
                </div>
              )}
            </div>
          </GlassCard>

          {/* Pricing & Financial Breakdown */}
          <GlassCard className="p-6">
            <SectionTitle icon={<CreditCardOutlined />} title="Payment breakdown" />

            <div className="mt-4 space-y-2">
              <SummaryRow
                label="Products subtotal"
                value={formatCurrency(breakdown.products_price || breakdown.subtotal)}
              />
              <SummaryRow
                label="Delivery / shipping fee"
                value={formatCurrency(breakdown.delivery_charge)}
              />
              {breakdown.serviceFee > 0 && (
                <SummaryRow
                  label="Platform service fee"
                  value={formatCurrency(breakdown.serviceFee)}
                />
              )}
              <SummaryRow
                label="Estimated tax"
                value={formatCurrency(breakdown.tax)}
              />
              {breakdown.discount_amount > 0 && (
                <SummaryRow
                  label={order.coupon ? `Discount (${order.coupon})` : "Discount applied"}
                  value={`-${formatCurrency(breakdown.discount_amount)}`}
                  accent="success"
                />
              )}

              <div className="mt-4 flex items-center justify-between rounded-xl border border-navy-700/80 bg-navy-900/60 p-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-mist-400 font-medium">
                    Total Amount
                  </div>
                  <div className="text-xs text-mist-500">
                    Payment status: <span className="text-cloud-200 capitalize">{order.payment_status}</span>
                  </div>
                </div>
                <div className="font-display text-2xl md:text-3xl font-bold text-warning">
                  {formatCurrency(breakdown.total_price)}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Refund Notice (if attached to order) */}
          {order.refund && (
            <GlassCard className="p-6 border-warning/30 bg-warning/5">
              <SectionTitle
                icon={<RollbackOutlined className="text-warning" />}
                title="Refund record attached"
                badge={
                  <Link
                    to={`/store/refunds/${order.refund._id}`}
                    className="text-xs font-semibold text-warning underline hover:text-cloud-100"
                  >
                    View refund review →
                  </Link>
                }
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                <div>
                  <div className="text-xs text-mist-400">Refund amount</div>
                  <div className="font-display text-lg font-semibold text-cloud-100">
                    {formatCurrency(order.refund.refundAmount ?? 0)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-mist-400">Refund status</div>
                  <div className="font-medium text-cloud-100 capitalize">
                    {order.refund.status ?? "Pending"}
                  </div>
                </div>
                {order.refund.adminNote && (
                  <div className="sm:col-span-2">
                    <div className="text-xs text-mist-400">Admin note</div>
                    <div className="text-cloud-200 text-sm mt-0.5">
                      {order.refund.adminNote}
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Column: Customer Details, Delivery Address & Transaction Info */}
        <div className="space-y-6">
          {/* Customer Details */}
          <GlassCard className="p-6">
            <SectionTitle
              icon={<UserOutlined />}
              title="Customer details"
              badge={
                order.user?._id && (
                  <Link
                    to={`/users/${order.user._id}`}
                    className="text-xs text-violet-glow hover:underline"
                  >
                    View profile →
                  </Link>
                )
              }
            />

            <div className="mt-4 flex items-center gap-3.5 rounded-2xl border border-navy-700/60 bg-navy-800/40 p-4">
              <Avatar
                src={getImageUrl(order?.user?.image || "")}
                icon={<UserOutlined />}
                size={52}
                className="bg-violet-600/25! text-violet-glow! ring-2 ring-violet-500/20"
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-cloud-100 text-base truncate">
                  {order?.user?.name ?? "Deleted customer"}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-mist-400 truncate mt-0.5">
                  <MailOutlined className="text-mist-500" />
                  <span className="truncate">{order?.user?.email ?? "No email"}</span>
                  {order?.user?.email && (
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(order.user.email, "email", "Customer email")
                      }
                      className="ml-1 text-mist-500 hover:text-cloud-100"
                    >
                      {copiedKey === "email" ? (
                        <CheckOutlined className="text-success" />
                      ) : (
                        <CopyOutlined />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-sm">
              {contactNumber && (
                <div className="flex items-center justify-between py-1.5 border-b border-navy-800/40">
                  <span className="text-mist-400 flex items-center gap-1.5">
                    <PhoneOutlined /> Contact phone
                  </span>
                  <span className="font-medium text-cloud-100">{contactNumber}</span>
                </div>
              )}
              {order.user?._id && (
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-mist-400">User account ID</span>
                  <span className="font-mono text-xs text-mist-300">
                    {order.user._id}
                  </span>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Shipping & Delivery Address */}
          <GlassCard className="p-6">
            <SectionTitle icon={<EnvironmentOutlined />} title="Shipping information" />

            <div className="mt-4 space-y-4">
              {contactNumber && (
                <div className="flex items-start gap-3 rounded-xl border border-navy-700/60 bg-navy-800/30 p-3.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-success/15 text-success">
                    <PhoneOutlined />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-mist-500">
                      Recipient phone
                    </div>
                    <div className="font-medium text-cloud-100 text-sm mt-0.5">
                      {contactNumber}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 rounded-xl border border-navy-700/60 bg-navy-800/30 p-3.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 text-violet-glow">
                  <EnvironmentOutlined />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-mist-500">
                    Delivery address
                  </div>
                  {shippingAddress ? (
                    <p className="mt-1 text-sm font-medium leading-relaxed text-cloud-100">
                      {shippingAddress}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-mist-500">No physical address specified.</p>
                  )}
                </div>
              </div>

              {order.address_breakdown && (
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  {order.address_breakdown.city && (
                    <div className="rounded-lg bg-navy-900/40 p-2.5">
                      <div className="text-mist-500">City</div>
                      <div className="font-medium text-cloud-200 mt-0.5">
                        {order.address_breakdown.city}
                      </div>
                    </div>
                  )}
                  {order.address_breakdown.postal_code && (
                    <div className="rounded-lg bg-navy-900/40 p-2.5">
                      <div className="text-mist-500">Postal code</div>
                      <div className="font-medium text-cloud-200 mt-0.5">
                        {order.address_breakdown.postal_code}
                      </div>
                    </div>
                  )}
                  {order.address_breakdown.country && (
                    <div className="rounded-lg bg-navy-900/40 p-2.5 col-span-2">
                      <div className="text-mist-500">Country</div>
                      <div className="font-medium text-cloud-200 mt-0.5">
                        {order.address_breakdown.country}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </GlassCard>

          {/* Payment & Security Metadata */}
          <GlassCard className="p-6">
            <SectionTitle icon={<SafetyCertificateOutlined />} title="Transaction identifiers" />

            <div className="mt-4 space-y-3">
              <div>
                <div className="text-xs text-mist-400">Order ID</div>
                <div className="mt-1 flex items-center justify-between rounded-xl border border-navy-700/60 bg-navy-900/60 px-3 py-2 font-mono text-xs text-cloud-100">
                  <span className="truncate">{order.order_id}</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(order.order_id, "order_id", "Order ID")}
                    className="text-mist-400 hover:text-cloud-100"
                  >
                    {copiedKey === "order_id" ? (
                      <CheckOutlined className="text-success" />
                    ) : (
                      <CopyOutlined />
                    )}
                  </button>
                </div>
              </div>

              {order.payment_intent_id ? (
                <div>
                  <div className="text-xs text-mist-400">Stripe payment intent</div>
                  <div className="mt-1 flex items-center justify-between rounded-xl border border-navy-700/60 bg-navy-900/60 px-3 py-2 font-mono text-xs text-cloud-100">
                    <span className="truncate max-w-[220px]">{order.payment_intent_id}</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          order.payment_intent_id || "",
                          "payment_intent",
                          "Payment Intent ID",
                        )
                      }
                      className="text-mist-400 hover:text-cloud-100"
                    >
                      {copiedKey === "payment_intent" ? (
                        <CheckOutlined className="text-success" />
                      ) : (
                        <CopyOutlined />
                      )}
                    </button>
                  </div>
                </div>
              ) : null}

              {order.transaction_id ? (
                <div>
                  <div className="text-xs text-mist-400">Transaction ID</div>
                  <div className="mt-1 flex items-center justify-between rounded-xl border border-navy-700/60 bg-navy-900/60 px-3 py-2 font-mono text-xs text-cloud-100">
                    <span className="truncate max-w-[220px]">{order.transaction_id}</span>
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(
                          order.transaction_id || "",
                          "transaction_id",
                          "Transaction ID",
                        )
                      }
                      className="text-mist-400 hover:text-cloud-100"
                    >
                      {copiedKey === "transaction_id" ? (
                        <CheckOutlined className="text-success" />
                      ) : (
                        <CopyOutlined />
                      )}
                    </button>
                  </div>
                </div>
              ) : null}

              <div className="pt-2 text-xs text-mist-500">
                Created: {order.createdAt ? formatDateTime(order.createdAt) : "—"}
                {order.updatedAt && (
                  <span className="block mt-0.5">
                    Last updated: {formatDateTime(order.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={deleteFlow.isOpen}
        loading={deleteFlow.loading}
        title={`Delete order #${order.order_id}?`}
        description="This will permanently delete this order record and its associated fulfillment details. This action cannot be undone."
        onConfirm={deleteFlow.confirm}
        onCancel={deleteFlow.cancel}
      />
    </div>
  );
}
