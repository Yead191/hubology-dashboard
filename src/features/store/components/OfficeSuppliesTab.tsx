import { useMemo, useState } from "react";
import { Button, Image, Input, Table, Tooltip, type TableProps } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { RatingStars } from "@/components/ui/RatingStars";
import { StatusTag } from "@/components/ui/StatusTag";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { formatCurrency } from "@/lib/utils";
import { useStore } from "../StoreContext";
import { OfficeSupplyFormModal } from "./OfficeSupplyFormModal";
import { ProductDetailDrawer } from "./ProductDetailDrawer";
import type { OfficeSupply } from "../types";

export function OfficeSuppliesTab() {
  const { officeSupplies, addOfficeSupply, updateOfficeSupply, removeOfficeSupply, removeOfficeReview } = useStore();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<OfficeSupply | null>(null);
  const [viewing, setViewing] = useState<OfficeSupply | null>(null);

  const deleteFlow = useConfirmDelete<OfficeSupply>((record) => {
    removeOfficeSupply(record.id);
    toast.success("Product removed", { description: `"${record.title}" was removed from the store.` });
  });

  const filtered = useMemo(
    () => officeSupplies.filter((p) => !search.trim() || p.title.toLowerCase().includes(search.toLowerCase())),
    [officeSupplies, search]
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (product: OfficeSupply) => {
    setEditing(product);
    setFormOpen(true);
    setViewing(null);
  };

  const handleSubmit = (input: Parameters<typeof addOfficeSupply>[0]) => {
    if (editing) {
      updateOfficeSupply(editing.id, input);
      toast.success("Product updated", { description: `"${input.title}" has been saved.` });
    } else {
      addOfficeSupply(input);
      toast.success("Product created", { description: `"${input.title}" is now live in the office supplies store.` });
    }
    setFormOpen(false);
  };

  const currentViewing = viewing ? officeSupplies.find((p) => p.id === viewing.id) ?? null : null;

  const columns: TableProps<OfficeSupply>["columns"] = [
    {
      title: "Product",
      key: "title",
      render: (_, record) => (
        <button className="flex items-center gap-3 text-left" onClick={() => setViewing(record)}>
          <Image src={record.coverImage} width={44} height={44} className="!rounded-lg" style={{ objectFit: "cover" }} preview={{ mask: false }} />
          <div className="min-w-0">
            <div className="font-medium text-cloud-100 hover:text-violet-glow">{record.title}</div>
            <div className="max-w-[220px] truncate text-xs text-mist-400">{record.subtitle}</div>
          </div>
        </button>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span className="font-medium text-cloud-100">{formatCurrency(price)}</span>,
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Rating",
      key: "rating",
      responsive: ["md"],
      render: (_, record) => (
        <div className="flex items-center gap-1.5">
          <RatingStars value={record.rating.average} />
          <span className="text-xs text-mist-600">({record.rating.totalReviews})</span>
        </div>
      ),
    },
    {
      title: "Stock",
      key: "inStock",
      responsive: ["lg"],
      render: (_, record) =>
        record.details.inStock ? (
          <StatusTag tone="success">In stock</StatusTag>
        ) : (
          <StatusTag tone="danger">Out of stock</StatusTag>
        ),
      filters: [
        { text: "In stock", value: true },
        { text: "Out of stock", value: false },
      ],
      onFilter: (value, record) => record.details.inStock === value,
    },
    {
      title: "",
      key: "actions",
      width: 130,
      render: (_, record) => (
        <div className="flex items-center justify-end gap-1">
          <Tooltip title="View">
            <Button type="text" icon={<EyeOutlined />} onClick={() => setViewing(record)} />
          </Tooltip>
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
      <PageToolbar eyebrow="Office supplies" count={filtered.length}>
        <Input
          allowClear
          prefix={<SearchOutlined className="text-mist-600" />}
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="!w-56"
        />
        <Button type="primary" icon={<PlusOutlined />} className="btn-gradient !border-0" onClick={openCreate}>
          New product
        </Button>
      </PageToolbar>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<PlusOutlined />}
          title="No office supplies yet"
          description="Add premium physical supplies, stationery, or tech devices."
          actionLabel="New product"
          onAction={openCreate}
        />
      ) : (
        <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 8, hideOnSinglePage: true }} />
      )}

      <OfficeSupplyFormModal open={formOpen} initial={editing} onCancel={() => setFormOpen(false)} onSubmit={handleSubmit} />

      {currentViewing && (
        <ProductDetailDrawer
          open={!!viewing}
          onClose={() => setViewing(null)}
          title={currentViewing.title}
          subtitle={currentViewing.subtitle}
          coverImage={currentViewing.coverImage}
          price={currentViewing.price}
          description={currentViewing.description}
          rating={currentViewing.rating}
          onEdit={() => openEdit(currentViewing)}
          onDelete={() => {
            setViewing(null);
            deleteFlow.request(currentViewing);
          }}
          onDeleteReview={(reviewId) => removeOfficeReview(currentViewing.id, reviewId)}
          detailsSlot={
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Material" value={currentViewing.details.material} />
              <Field label="Dimensions" value={currentViewing.details.dimensions} />
              <Field label="Weight" value={currentViewing.details.weight} />
              <Field label="Stock" value={currentViewing.details.inStock ? "In stock" : "Out of stock"} />
            </div>
          }
        />
      )}

      <ConfirmDeleteModal
        open={deleteFlow.isOpen}
        title={`Delete "${deleteFlow.target?.title}"?`}
        description="This removes the product from the office supplies store immediately. This can't be undone."
        loading={deleteFlow.loading}
        onConfirm={deleteFlow.confirm}
        onCancel={deleteFlow.cancel}
      />
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
