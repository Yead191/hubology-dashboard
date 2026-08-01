import type { ReactNode } from "react";
import { Avatar, Button, Drawer } from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { StatusTag } from "@/components/ui/StatusTag";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import type {
  ApiBooking,
  BookingStatus,
} from "@/redux/features/bookings/bookings.types";
import {
  bookingStatusLabelMap,
  bookingStatusToneMap,
  paymentStatusLabelMap,
  paymentStatusToneMap,
} from "../bookingStatusMaps";
import { BookingStatusSelect } from "./BookingStatusSelect";
import { getImageUrl } from "@/lib/getImageUrl";

export function BookingDetailDrawer({
  booking,
  open,
  updating,
  onClose,
  onStatusChange,
}: {
  booking: ApiBooking | null;
  open: boolean;
  updating?: boolean;
  onClose: () => void;
  onStatusChange: (status: BookingStatus) => void;
}) {
  if (!booking) return null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={460}
      title="Booking details"
      destroyOnHidden
    >
      <div className="flex items-start gap-4">
        <Avatar
          src={getImageUrl(booking.user.image)}
          size={56}
          className="bg-violet-600/30! text-violet-glow!"
        />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold text-cloud-100">
            {booking.user.name}
          </h2>
          <p className="truncate text-sm text-mist-400">{booking.user.email}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusTag tone={bookingStatusToneMap[booking.status]}>
              {bookingStatusLabelMap[booking.status]}
            </StatusTag>
            <StatusTag tone={paymentStatusToneMap[booking.paymentStatus]}>
              {paymentStatusLabelMap[booking.paymentStatus] ??
                booking.paymentStatus}
            </StatusTag>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-navy-700/60 bg-navy-800/40 p-4">
        <div className="text-xs font-medium uppercase tracking-wide text-mist-600">
          Service
        </div>
        <div className="mt-1 font-display text-base font-semibold text-cloud-100">
          {booking?.service?.title}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-mist-300">
          <DollarOutlined className="text-mist-600" />
          <span className="font-semibold text-cloud-100">
            {formatCurrency(booking.price)}
          </span>
        </div>
      </div>

      <Section title="Schedule">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field
            icon={<CalendarOutlined />}
            label="Preferred date"
            value={formatDate(booking.preferredDate)}
          />
          <Field
            icon={<ClockCircleOutlined />}
            label="Preferred time"
            value={booking.preferredTime || "—"}
          />
        </div>
      </Section>

      <Section title="Contact">
        <div className="flex flex-col gap-2.5 rounded-xl border border-navy-700/60 bg-navy-800/40 p-4 text-sm">
          <span className="flex items-center gap-2.5 text-mist-300">
            <UserOutlined className="text-mist-600" />
            {booking.user.name}
          </span>
          <a
            href={`mailto:${booking.user.email}`}
            className="flex items-center gap-2.5 text-mist-300 transition hover:text-cloud-100"
          >
            <MailOutlined className="text-mist-600" />
            {booking.user.email}
          </a>
        </div>
      </Section>

      {booking.note && (
        <Section title="Customer note">
          <div className="rounded-xl border border-navy-700/60 bg-navy-800/40 p-4 text-sm leading-relaxed text-mist-300">
            <FileTextOutlined className="mr-2 text-mist-600" />
            {booking.note}
          </div>
        </Section>
      )}

      <Section title="Payment">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <Field
            label="Payment status"
            value={
              paymentStatusLabelMap[booking.paymentStatus] ??
              booking.paymentStatus
            }
          />
          <Field
            label="Payment intent"
            value={booking.paymentIntentId || "—"}
            mono
          />
          <Field label="Booked on" value={formatDateTime(booking.createdAt)} />
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-6 mt-6 border-t border-navy-700/60 bg-[#0f1230]/95 px-6 py-4 backdrop-blur">
        <div className="mb-2 text-xs font-medium uppercase tracking-wide text-mist-600">
          Update status
        </div>
        <div className="flex gap-2">
          <BookingStatusSelect
            size="middle"
            className="flex-1"
            value={booking.status}
            disabled={updating}
            onChange={onStatusChange}
          />
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Drawer>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-5">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-mist-600">
        {title}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  icon,
  mono,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-mist-600">{label}</div>
      <div
        className={`mt-0.5 flex items-center gap-1.5 font-medium text-cloud-100 ${mono ? "font-mono text-xs" : ""}`}
      >
        {icon && <span className="text-mist-600">{icon}</span>}
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}
