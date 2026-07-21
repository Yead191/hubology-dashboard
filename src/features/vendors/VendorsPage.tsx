import { useMemo, useState } from "react";
import { Avatar, Button, Input, Segmented, Select, Table, Tooltip, type TableProps } from "antd";
import {
  UserOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusTag } from "@/components/ui/StatusTag";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { EXPERT_CATEGORIES } from "@/lib/constants";
import { useVendors } from "./VendorsContext";
import { VendorProfileDrawer } from "./components/VendorProfileDrawer";
import { VendorFormModal } from "./components/VendorFormModal";
import { statusToneMap, statusLabelMap, subscriptionToneMap, subscriptionLabelMap } from "./statusMaps";
import type { Vendor, VendorStatus } from "./types";

type StatusFilter = VendorStatus | "all";

export default function VendorsPage() {
  const { vendors, addVendor, updateVendor, removeVendor } = useVendors();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);
  const [viewing, setViewing] = useState<Vendor | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Vendor | null>(null);

  const deleteFlow = useConfirmDelete<Vendor>((record) => {
    removeVendor(record.id);
    toast.success("Vendor removed", { description: `${record.name} was removed from the directory.` });
  });

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const matchesSearch =
        !search.trim() ||
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.company.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || v.status === statusFilter;
      const matchesCategory = !categoryFilter || v.expertise.includes(categoryFilter);
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [vendors, search, statusFilter, categoryFilter]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (vendor: Vendor) => {
    setEditing(vendor);
    setFormOpen(true);
    setViewing(null);
  };

  const handleSubmit = (input: Parameters<typeof addVendor>[0]) => {
    if (editing) {
      updateVendor(editing.id, input);
      toast.success("Profile updated", { description: `${input.name}'s profile has been saved.` });
    } else {
      addVendor(input);
      toast.success("Vendor added", { description: `${input.name} was added as an approved vendor.` });
    }
    setFormOpen(false);
  };

  const handleDeleteFromDrawer = (vendor: Vendor) => {
    setViewing(null);
    deleteFlow.request(vendor);
  };

  const columns: TableProps<Vendor>["columns"] = [
    {
      title: "Vendor",
      key: "name",
      render: (_, record) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewing(record)}>
          <Avatar src={record.profile} icon={<UserOutlined />} size={40} />
          <div className="min-w-0">
            <div className="font-medium text-cloud-100 hover:text-violet-glow">{record.name}</div>
            <div className="max-w-[200px] truncate text-xs text-mist-400">
              {record.role} · {record.company}
            </div>
          </div>
        </button>
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
          {record.expertise.length > 2 && <StatusTag tone="neutral">+{record.expertise.length - 2}</StatusTag>}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: VendorStatus) => <StatusTag tone={statusToneMap[status]}>{statusLabelMap[status]}</StatusTag>,
      filters: [
        { text: "Pending", value: "pending" },
        { text: "Approved", value: "approved" },
        { text: "Rejected", value: "rejected" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Subscription",
      key: "subscription",
      responsive: ["lg"],
      render: (_, record) =>
        record.status === "approved" ? (
          <StatusTag tone={subscriptionToneMap[record.subscription]}>
            {subscriptionLabelMap[record.subscription]}
          </StatusTag>
        ) : (
          <span className="text-mist-600">—</span>
        ),
    },
    {
      title: "",
      key: "actions",
      width: 130,
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip title="View profile">
            <Button type="text" icon={<EyeOutlined />} onClick={() => setViewing(record)} />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Tooltip title="Remove">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteFlow.request(record)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageToolbar eyebrow="All vendors" count={filtered.length}>
        <Segmented
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as StatusFilter)}
          options={[
            { label: "All", value: "all" },
            { label: "Approved", value: "approved" },
            { label: "Pending", value: "pending" },
            { label: "Rejected", value: "rejected" },
          ]}
        />
        <Select
          allowClear
          placeholder="Category"
          className="!w-44"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={EXPERT_CATEGORIES.map((c) => ({ label: c, value: c }))}
        />
        <Input
          allowClear
          prefix={<SearchOutlined className="text-mist-600" />}
          placeholder="Search vendors…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!w-52"
        />
        <Button type="primary" icon={<PlusOutlined />} className="btn-gradient !border-0" onClick={openCreate}>
          Add vendor
        </Button>
      </PageToolbar>

      <GlassCard flat padded={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<UserOutlined />}
            title="No vendors match your filters"
            description="Try adjusting your search or filters, or add a vendor manually."
            actionLabel="Add vendor"
            onAction={openCreate}
          />
        ) : (
          <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 8, hideOnSinglePage: true }} />
        )}
      </GlassCard>

      <VendorProfileDrawer
        vendor={viewing}
        open={!!viewing}
        onClose={() => setViewing(null)}
        onEdit={openEdit}
        onDelete={handleDeleteFromDrawer}
      />

      <VendorFormModal open={formOpen} initial={editing} onCancel={() => setFormOpen(false)} onSubmit={handleSubmit} />

      <ConfirmDeleteModal
        open={deleteFlow.isOpen}
        title={`Remove ${deleteFlow.target?.name}?`}
        description="This permanently removes the vendor and their profile from Hubology. This can't be undone."
        loading={deleteFlow.loading}
        onConfirm={deleteFlow.confirm}
        onCancel={deleteFlow.cancel}
      />
    </div>
  );
}
