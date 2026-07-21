import { Avatar, Button, Drawer } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  LinkedinFilled,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { StatusTag } from "@/components/ui/StatusTag";
import { formatDate } from "@/lib/utils";
import type { Vendor } from "../types";
import { statusToneMap, statusLabelMap, subscriptionToneMap, subscriptionLabelMap } from "../statusMaps";

export function VendorProfileDrawer({
  vendor,
  open,
  onClose,
  onEdit,
  onDelete,
}: {
  vendor: Vendor | null;
  open: boolean;
  onClose: () => void;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}) {
  if (!vendor) return null;

  return (
    <Drawer open={open} onClose={onClose} width={460} title="Vendor profile" destroyOnHidden>
      <div className="flex items-start gap-4">
        <Avatar src={vendor.profile} icon={<UserOutlined />} size={64} />
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-lg font-semibold text-cloud-100">{vendor.name}</h2>
          <p className="text-sm text-mist-400">
            {vendor.role} · {vendor.company}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusTag tone={statusToneMap[vendor.status]}>{statusLabelMap[vendor.status]}</StatusTag>
            {vendor.status === "approved" && (
              <StatusTag tone={subscriptionToneMap[vendor.subscription]}>
                {subscriptionLabelMap[vendor.subscription]}
              </StatusTag>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 rounded-xl border border-navy-700/60 bg-navy-800/40 p-4 text-sm">
        <ContactRow icon={<MailOutlined />} value={vendor.contact.email} href={`mailto:${vendor.contact.email}`} />
        <ContactRow icon={<PhoneOutlined />} value={vendor.contact.phone} href={`tel:${vendor.contact.phone}`} />
        <ContactRow icon={<EnvironmentOutlined />} value={vendor.location} />
        <ContactRow icon={<LinkedinFilled />} value="LinkedIn profile" href={vendor.linkedin} />
      </div>

      <Section title="About">
        <p className="text-sm leading-relaxed text-mist-400">{vendor.about}</p>
      </Section>

      <Section title="Expertise">
        <div className="flex flex-wrap gap-1.5">
          {vendor.expertise.map((e) => (
            <StatusTag key={e} tone="violet">
              {e}
            </StatusTag>
          ))}
        </div>
      </Section>

      <Section title="Engagement details">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Experience" value={vendor.yearsExperience} />
          <Field label="Degree" value={vendor.degree} />
          <Field label="Hourly rate" value={vendor.hourlyRate} />
          <Field label="Availability" value={vendor.availability} />
        </div>
        <div className="mt-3">
          <div className="text-xs text-mist-600">Consultation types</div>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {vendor.consultationTypes.map((c) => (
              <StatusTag key={c} tone="neutral">
                {c}
              </StatusTag>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Application">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Applied" value={formatDate(vendor.appliedAt)} />
          <Field label="Reviewed" value={vendor.reviewedAt ? formatDate(vendor.reviewedAt) : "—"} />
        </div>
        {vendor.status === "rejected" && vendor.rejectionReason && (
          <div className="mt-3 rounded-lg border border-danger/25 bg-danger/10 p-3 text-xs text-danger">
            {vendor.rejectionReason}
          </div>
        )}
      </Section>

      <div className="mt-6 flex gap-2 border-t border-navy-700/60 pt-4">
        <Button icon={<EditOutlined />} block onClick={() => onEdit(vendor)}>
          Edit profile
        </Button>
        <Button icon={<DeleteOutlined />} danger block onClick={() => onDelete(vendor)}>
          Remove
        </Button>
      </div>
    </Drawer>
  );
}

function ContactRow({ icon, value, href }: { icon: React.ReactNode; value: string; href?: string }) {
  const content = (
    <span className="flex items-center gap-2.5 text-mist-300">
      <span className="text-mist-600">{icon}</span>
      <span className="truncate">{value}</span>
    </span>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="transition hover:text-cloud-100">
        {content}
      </a>
    );
  }
  return content;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5">
      <div className="mb-2 text-xs font-medium uppercase tracking-wide text-mist-600">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-mist-600">{label}</div>
      <div className="mt-0.5 font-medium text-cloud-100">{value}</div>
    </div>
  );
}
