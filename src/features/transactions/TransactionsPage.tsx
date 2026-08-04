import { useEffect, useMemo, useState } from "react";
import { Avatar, Button, Table, type TableProps } from "antd";
import {
  EyeOutlined,
  HistoryOutlined,
  UserOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CrownOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusTag } from "@/components/ui/StatusTag";
import { SearchInput } from "@/components/ui/SearchInput";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import { useGetTransactionsQuery } from "@/redux/features/transactions/transactionsApi";
import type { ApiTransaction } from "@/redux/features/transactions/transactions.types";
import {
  transactionCategoryToneMap,
  transactionStatusToneMap,
  transactionTypeToneMap,
} from "./statusMaps";
import { TransactionDetailModal } from "./components/TransactionDetailModal";

function categoryIcon(category: string) {
  if (category === "Membership") return <CrownOutlined />;
  if (category === "Shop") return <ShoppingOutlined />;
  if (category === "Service") return <AppstoreOutlined />;
  return <DollarOutlined />;
}

export default function TransactionsPage() {
  const {
    value: search,
    setValue: setSearch,
    debouncedValue: searchTerm,
  } = useDebouncedSearch();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewing, setViewing] = useState<ApiTransaction | null>(null);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const { data, isFetching } = useGetTransactionsQuery({
    page,
    limit,
    searchTerm,
  });

  const transactions = data?.data ?? [];
  const pagination = data?.pagination;

  const columns: TableProps<ApiTransaction>["columns"] = [
    {
      title: "Transaction",
      key: "id",
      render: (_, record) => (
        <button
          type="button"
          className="text-left"
          onClick={() => setViewing(record)}
        >
          <code className="font-mono text-xs font-medium text-cloud-100 transition hover:text-violet-glow">
            {record._id.slice(0, 10)}…
          </code>
          <div className="mt-0.5 text-[11px] text-mist-500">
            {record.createdAt ? formatDate(record.createdAt) : "—"}
          </div>
        </button>
      ),
    },
    {
      title: "Customer",
      key: "user",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={getImageUrl(record?.user?.image || "")}
            icon={<UserOutlined />}
            size={38}
            className="bg-violet-600/25! text-violet-glow!"
          />
          <div className="min-w-0">
            <div className="font-medium text-cloud-100">{record?.user?.name || "—"}</div>
            <div className="max-w-48 truncate text-xs text-mist-400">
              {record?.user?.email || "—"}
            </div>  
          </div>
        </div>
      ),
    },
    {
      title: "Category",
      key: "category",
      responsive: ["md"],
      render: (_, record) => (
        <StatusTag
          tone={transactionCategoryToneMap[record.category] ?? "neutral"}
          icon={categoryIcon(record.category)}
        >
          {record.category}
        </StatusTag>
      ),
    },
    {
      title: "Amount",
      key: "total_price",
      render: (_, record) => (
        <div>
          <div className="font-display font-semibold text-cloud-100">
            {formatCurrency(record.total_price)}
          </div>
          <div className="text-[11px] text-mist-500">
            Fee {formatCurrency(record.platform_fee)}
          </div>
        </div>
      ),
    },
    {
      title: "Type",
      key: "type",
      responsive: ["lg"],
      render: (_, record) => (
        <StatusTag tone={transactionTypeToneMap[record.type] ?? "neutral"}>
          {record.type}
        </StatusTag>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <StatusTag tone={transactionStatusToneMap[record.status] ?? "neutral"}>
          {record.status}
        </StatusTag>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 96,
      render: (_, record) => (
        <Button
          type="text"
          className="text-mist-400! hover:bg-violet-600/15! hover:text-violet-glow!"
          icon={<EyeOutlined />}
          onClick={() => setViewing(record)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="aurora-field glass-panel mb-6 overflow-hidden p-6 md:p-7">
        <div className="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="pointer-events-none absolute -right-8 -top-16 h-44 w-44 rounded-full bg-warning/15 blur-[60px]" />
          <div className="pointer-events-none absolute -bottom-20 left-1/4 h-36 w-36 rounded-full bg-violet-600/20 blur-[50px]" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#8131F0] to-[#4A1C8A] shadow-[0_8px_24px_-8px_rgba(129,49,240,0.65)]">
              <HistoryOutlined className="text-lg text-white" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-cloud-100">
                Transaction history
              </h2>
              <p className="mt-1 max-w-xl text-sm text-mist-400">
                Review payments across membership, shop, and service purchases.
                Search by transaction ID.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl border border-warning/25 bg-warning/10 px-4 py-3 text-sm">
            <div className="font-semibold text-warning">
              {pagination?.total ?? 0} total
            </div>
            <div className="text-xs text-mist-400">Ledger entries</div>
          </div>
        </div>
      </div>

      <GlassCard flat className="mb-4">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            placeholder="Search by transaction ID…"
            value={search}
            onChange={setSearch}
            className="sm:w-80!"
          />
          <div className="text-xs text-mist-600">
            {pagination?.total ?? 0} transaction
            {(pagination?.total ?? 0) === 1 ? "" : "s"}
          </div>
        </div>
      </GlassCard>

      <GlassCard flat padded={false}>
        {!isFetching && transactions.length === 0 ? (
          <EmptyState
            icon={<HistoryOutlined />}
            title="No transactions found"
            description="Try another transaction ID, or clear the search to see the full ledger."
          />
        ) : (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={transactions}
            loading={isFetching}
            pagination={{
              current: pagination?.page ?? page,
              pageSize: pagination?.limit ?? limit,
              total: pagination?.total ?? 0,
              showSizeChanger: true,
              showTotal: (total) => `${total} transactions`,
              onChange: (nextPage, nextPageSize) => {
                setPage(nextPage);
                setLimit(nextPageSize);
              },
            }}
          />
        )}
      </GlassCard>

      <TransactionDetailModal
        transaction={viewing}
        open={!!viewing}
        onClose={() => setViewing(null)}
      />
    </div>
  );
}
