import { useMemo, useState } from "react";
import { Avatar, Button, Segmented, Table, type TableProps } from "antd";
import { UserOutlined, EyeOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusTag } from "@/components/ui/StatusTag";
import { formatDate } from "@/lib/utils";
import { useVendors } from "./VendorsContext";
import { VendorReviewModal } from "./components/VendorReviewModal";
import { statusToneMap, statusLabelMap } from "./statusMaps";
import type { Vendor, VendorStatus } from "./types";

type FilterValue = VendorStatus | "all";

export default function VendorApplicationsPage() {
  const { vendors, approveVendor, rejectVendor } = useVendors();
  const [filter, setFilter] = useState<FilterValue>("pending");
  const [reviewing, setReviewing] = useState<Vendor | null>(null);

  const filtered = useMemo(() => {
    const list = filter === "all" ? vendors : vendors.filter((v) => v.status === filter);
    return [...list].sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
  }, [vendors, filter]);

  const pendingCount = vendors.filter((v) => v.status === "pending").length;

  const handleApprove = (vendor: Vendor) => {
    approveVendor(vendor.id);
    toast.success("Application approved", {
      description: `${vendor.name} can now subscribe to a vendor package on the frontend.`,
    });
    setReviewing(null);
  };

  const handleReject = (vendor: Vendor, reason: string) => {
    rejectVendor(vendor.id, reason);
    toast.message("Application rejected", { description: `${vendor.name} has been notified of the decision.` });
    setReviewing(null);
  };

  const columns: TableProps<Vendor>["columns"] = [
    {
      title: "Applicant",
      key: "name",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.profile} icon={<UserOutlined />} size={40} />
          <div className="min-w-0">
            <div className="font-medium text-cloud-100">{record.name}</div>
            <div className="max-w-[220px] truncate text-xs text-mist-400">
              {record.role} · {record.company}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Expertise",
      key: "expertise",
      responsive: ["md"],
      render: (_, record) => (
        <div className="flex flex-wrap gap-1">
          {record.expertise.slice(0, 2).map((e) => (
            <StatusTag key={e} tone="violet">
              {e}
            </StatusTag>
          ))}
        </div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      responsive: ["lg"],
      render: (value: string) => <span className="text-mist-400">{value}</span>,
    },
    {
      title: "Applied",
      dataIndex: "appliedAt",
      key: "appliedAt",
      render: (value: string) => <span className="text-mist-400">{formatDate(value)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: VendorStatus) => <StatusTag tone={statusToneMap[status]}>{statusLabelMap[status]}</StatusTag>,
    },
    {
      title: "",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => setReviewing(record)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageToolbar eyebrow="Vendor applications" count={filtered.length}>
        <Segmented
          value={filter}
          onChange={(v) => setFilter(v as FilterValue)}
          options={[
            { label: `Pending (${pendingCount})`, value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Rejected", value: "rejected" },
            { label: "All", value: "all" },
          ]}
        />
      </PageToolbar>

      <GlassCard flat padded={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<UserOutlined />}
            title="No applications here"
            description="New vendor applications submitted from the website will show up in this queue."
          />
        ) : (
          <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 8, hideOnSinglePage: true }} />
        )}
      </GlassCard>

      <VendorReviewModal
        vendor={reviewing}
        open={!!reviewing}
        onClose={() => setReviewing(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
