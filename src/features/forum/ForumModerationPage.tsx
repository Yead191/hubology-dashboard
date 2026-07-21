import { useMemo, useState } from "react";
import { Avatar, Button, Segmented, Table, type TableProps } from "antd";
import { UserOutlined, EyeOutlined, FlagFilled } from "@ant-design/icons";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { PageToolbar } from "@/components/ui/PageToolbar";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusTag } from "@/components/ui/StatusTag";
import { formatDate } from "@/lib/utils";
import { useForum } from "./ForumContext";
import { ReportedPostDrawer } from "./components/ReportedPostDrawer";
import type { ForumPost, PostStatus } from "./types";

type FilterValue = PostStatus | "all";

const STATUS_TONE = { published: "success", reported: "warning", removed: "danger" } as const;
const STATUS_LABEL = { published: "Published", reported: "Reported", removed: "Removed" } as const;

export default function ForumModerationPage() {
  const { posts, dismissReport, removePost, restorePost, deletePostPermanently } = useForum();
  const [filter, setFilter] = useState<FilterValue>("reported");
  const [viewing, setViewing] = useState<ForumPost | null>(null);

  const filtered = useMemo(() => {
    const list = filter === "all" ? posts : posts.filter((p) => p.status === filter);
    return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [posts, filter]);

  const reportedCount = posts.filter((p) => p.status === "reported").length;
  const currentViewing = viewing ? posts.find((p) => p.id === viewing.id) ?? null : null;

  const handleDismiss = (post: ForumPost) => {
    dismissReport(post.id);
    toast.success("Report dismissed", { description: `"${post.title}" stays live on the forum.` });
    setViewing(null);
  };

  const handleRemove = (post: ForumPost) => {
    removePost(post.id);
    toast.message("Post removed", { description: `"${post.title}" was taken down from the forum.` });
    setViewing(null);
  };

  const handleRestore = (post: ForumPost) => {
    restorePost(post.id);
    toast.success("Post restored", { description: `"${post.title}" is live again.` });
    setViewing(null);
  };

  const handleDeletePermanently = (post: ForumPost) => {
    deletePostPermanently(post.id);
    toast.success("Post deleted", { description: `The post record has been permanently removed.` });
    setViewing(null);
  };

  const columns: TableProps<ForumPost>["columns"] = [
    {
      title: "Post",
      key: "title",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.authorAvatar} icon={<UserOutlined />} size={38} />
          <div className="min-w-0">
            <div className="max-w-[320px] truncate font-medium text-cloud-100">{record.title}</div>
            <div className="text-xs text-mist-400">{record.authorName}</div>
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
      title: "Reports",
      key: "reports",
      render: (_, record) =>
        record.reports.length > 0 ? (
          <span className="inline-flex items-center gap-1 text-danger">
            <FlagFilled className="text-[11px]" /> {record.reports.length}
          </span>
        ) : (
          <span className="text-mist-600">—</span>
        ),
    },
    {
      title: "Posted",
      dataIndex: "createdAt",
      key: "createdAt",
      responsive: ["lg"],
      render: (value: string) => <span className="text-mist-400">{formatDate(value)}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: PostStatus) => <StatusTag tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</StatusTag>,
    },
    {
      title: "",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button size="small" icon={<EyeOutlined />} onClick={() => setViewing(record)}>
          Review
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageToolbar eyebrow="Forum moderation" count={filtered.length}>
        <Segmented
          value={filter}
          onChange={(v) => setFilter(v as FilterValue)}
          options={[
            { label: `Reported (${reportedCount})`, value: "reported" },
            { label: "Published", value: "published" },
            { label: "Removed", value: "removed" },
            { label: "All", value: "all" },
          ]}
        />
      </PageToolbar>

      <GlassCard flat padded={false}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FlagFilled />}
            title="Nothing here"
            description="Posts reported by the community will show up in this queue for review."
          />
        ) : (
          <Table rowKey="id" columns={columns} dataSource={filtered} pagination={{ pageSize: 8, hideOnSinglePage: true }} />
        )}
      </GlassCard>

      <ReportedPostDrawer
        post={currentViewing}
        open={!!viewing}
        onClose={() => setViewing(null)}
        onDismissReport={handleDismiss}
        onRemovePost={handleRemove}
        onRestorePost={handleRestore}
        onDeletePermanently={handleDeletePermanently}
      />
    </div>
  );
}
