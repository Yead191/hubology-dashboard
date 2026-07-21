import { useMemo, useState } from "react";
import { Button, Image, Input, Table, Tooltip, type TableProps } from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { toast } from "sonner";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { RatingStars } from "@/components/ui/RatingStars";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { formatCurrency } from "@/lib/utils";
import { useStore } from "../StoreContext";
import { DigitalProductFormModal } from "./DigitalProductFormModal";
import { ProductDetailDrawer } from "./ProductDetailDrawer";
import type { DigitalProduct } from "../types";

export function DigitalProductsTab() {
  const { digitalProducts, addDigitalProduct, updateDigitalProduct, removeDigitalProduct, removeDigitalReview } = useStore();
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<DigitalProduct | null>(null);
  const [viewing, setViewing] = useState<DigitalProduct | null>(null);

  const deleteFlow = useConfirmDelete<DigitalProduct>((record) => {
    removeDigitalProduct(record.id);
    toast.success("Product removed", { description: `"${record.title}" was removed from the store.` });
  });

  const filtered = useMemo(
    () => digitalProducts.filter((p) => !search.trim() || p.title.toLowerCase().includes(search.toLowerCase())),
    [digitalProducts, search]
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (product: DigitalProduct) => {
    setEditing(product);
    setFormOpen(true);
    setViewing(null);
  };

  const handleSubmit = (input: Parameters<typeof addDigitalProduct>[0]) => {
    if (editing) {
      updateDigitalProduct(editing.id, input);
      toast.success("Product updated", { description: `"${input.title}" has been saved.` });
    } else {
      addDigitalProduct(input);
      toast.success("Product created", { description: `"${input.title}" is now live in the digital store.` });
    }
    setFormOpen(false);
  };

  const currentViewing = viewing ? digitalProducts.find((p) => p.id === viewing.id) ?? null : null;

  const columns: TableProps<DigitalProduct>["columns"] = [
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
      title: "Pages",
      key: "pages",
      responsive: ["lg"],
      render: (_, record) => <span className="text-mist-400">{record.details.pages}</span>,
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
      <PageToolbar eyebrow="Digital products" count={filtered.length}>
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
          title="No digital products yet"
          description="Add e-books, checklists, or templates for the digital store."
          actionLabel="New product"
          onAction={openCreate}
        />
      ) : (
        <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 8, hideOnSinglePage: true }} />
      )}

      <DigitalProductFormModal open={formOpen} initial={editing} onCancel={() => setFormOpen(false)} onSubmit={handleSubmit} />

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
          onDeleteReview={(reviewId) => removeDigitalReview(currentViewing.id, reviewId)}
          detailsSlot={
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Publisher" value={currentViewing.details.publisher} />
              <Field label="First published" value={currentViewing.details.firstPublish} />
              <Field label="Edition" value={currentViewing.details.edition} />
              <Field label="Pages" value={String(currentViewing.details.pages)} />
            </div>
          }
        />
      )}

      <ConfirmDeleteModal
        open={deleteFlow.isOpen}
        title={`Delete "${deleteFlow.target?.title}"?`}
        description="This removes the product from the digital store immediately. This can't be undone."
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
