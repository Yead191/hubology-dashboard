import { useMemo, useState } from "react";
import { Button, Image, Input, Segmented, Table, Tooltip, type TableProps } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, StarFilled } from "@ant-design/icons";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusTag } from "@/components/ui/StatusTag";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useServices } from "./ServicesContext";
import { ServiceFormModal } from "./components/ServiceFormModal";
import type { Service } from "./types";

type FeaturedFilter = "all" | "featured" | "standard";

export default function ServicesPage() {
  const { services, addService, updateService, removeService } = useServices();
  const [search, setSearch] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const deleteFlow = useConfirmDelete<Service>((record) => {
    removeService(record.id);
    toast.success("Service removed", { description: `"${record.title}" is no longer listed.` });
  });

  const filtered = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch =
        !search.trim() ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase());
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && s.featured) ||
        (featuredFilter === "standard" && !s.featured);
      return matchesSearch && matchesFeatured;
    });
  }, [services, search, featuredFilter]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditing(service);
    setFormOpen(true);
  };

  const handleSubmit = (input: Parameters<typeof addService>[0]) => {
    if (editing) {
      updateService(editing.id, input);
      toast.success("Service updated", { description: `"${input.title}" has been saved.` });
    } else {
      addService(input);
      toast.success("Service created", { description: `"${input.title}" is now live on the services page.` });
    }
    setFormOpen(false);
  };

  const columns: TableProps<Service>["columns"] = [
    {
      title: "Service",
      dataIndex: "title",
      key: "title",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.image}
            alt={record.title}
            width={48}
            height={48}
            className="!rounded-lg object-cover"
            style={{ objectFit: "cover" }}
            preview={{ mask: false }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-medium text-cloud-100">
              {record.title}
              {record.featured && <StarFilled className="text-[12px] text-warning" />}
            </div>
            <div className="max-w-[280px] truncate text-xs text-mist-400">{record.tagline}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      responsive: ["md"],
      render: (category: string) => <StatusTag tone="violet">{category}</StatusTag>,
    },
    {
      title: "Price",
      key: "price",
      render: (_, record) => (
        <span className="font-medium text-cloud-100">
          {formatCurrency(record.price.amount, record.price.currency)}
        </span>
      ),
    },
    {
      title: "Billed",
      key: "frequency",
      responsive: ["lg"],
      render: (_, record) => <span className="text-mist-400">{record.price.frequency}</span>,
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      responsive: ["lg"],
      render: (value: string) => <span className="text-mist-400">{formatDate(value)}</span>,
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: "",
      key: "actions",
      width: 96,
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => deleteFlow.request(record)} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageToolbar eyebrow="Services" count={filtered.length}>
        <Segmented
          value={featuredFilter}
          onChange={(v) => setFeaturedFilter(v as FeaturedFilter)}
          options={[
            { label: "All", value: "all" },
            { label: "Featured", value: "featured" },
            { label: "Standard", value: "standard" },
          ]}
        />
        <Input
          allowClear
          prefix={<SearchOutlined className="text-mist-600" />}
          placeholder="Search services…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!w-56"
        />
        <Button type="primary" icon={<PlusOutlined />} className="btn-gradient !border-0" onClick={openCreate}>
          New service
        </Button>
      </PageToolbar>

      <GlassCard flat padded={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<PlusOutlined />}
            title="No services match your filters"
            description="Try clearing the search or filter, or create a new service package."
            actionLabel="New service"
            onAction={openCreate}
          />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filtered}
            pagination={{ pageSize: 8, hideOnSinglePage: true }}
            className="hubology-table"
          />
        )}
      </GlassCard>

      <ServiceFormModal open={formOpen} initial={editing} onCancel={() => setFormOpen(false)} onSubmit={handleSubmit} />

      <ConfirmDeleteModal
        open={deleteFlow.isOpen}
        title={`Delete "${deleteFlow.target?.title}"?`}
        description="This removes the service package from the live services page immediately. This can't be undone."
        loading={deleteFlow.loading}
        onConfirm={deleteFlow.confirm}
        onCancel={deleteFlow.cancel}
      />
    </div>
  );
}
