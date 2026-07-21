import { Avatar, Button, Drawer, Popconfirm } from "antd";
import { UserOutlined, FlagFilled, CheckCircleOutlined, DeleteOutlined, UndoOutlined } from "@ant-design/icons";
import { StatusTag } from "@/components/ui/StatusTag";
import { formatDateTime } from "@/lib/utils";
import type { ForumPost } from "../types";

const STATUS_TONE = { published: "success", reported: "warning", removed: "danger" } as const;
const STATUS_LABEL = { published: "Published", reported: "Reported", removed: "Removed" } as const;

export function ReportedPostDrawer({
  post,
  open,
  onClose,
  onDismissReport,
  onRemovePost,
  onRestorePost,
  onDeletePermanently,
}: {
  post: ForumPost | null;
  open: boolean;
  onClose: () => void;
  onDismissReport: (post: ForumPost) => void;
  onRemovePost: (post: ForumPost) => void;
  onRestorePost: (post: ForumPost) => void;
  onDeletePermanently: (post: ForumPost) => void;
}) {
  if (!post) return null;

  return (
    <Drawer open={open} onClose={onClose} width={480} title="Forum post" destroyOnHidden>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar src={post.authorAvatar} icon={<UserOutlined />} size={36} />
          <div>
            <div className="text-sm font-medium text-cloud-100">{post.authorName}</div>
            <div className="text-xs text-mist-600">{formatDateTime(post.createdAt)}</div>
          </div>
        </div>
        <StatusTag tone={STATUS_TONE[post.status]}>{STATUS_LABEL[post.status]}</StatusTag>
      </div>

      <h2 className="mt-4 font-display text-base font-semibold leading-snug text-cloud-100">{post.title}</h2>
      <StatusTag tone="violet">{post.category}</StatusTag>
      <p className="mt-3 text-sm leading-relaxed text-mist-400">{post.body}</p>

      <div className="mt-4 flex gap-4 text-xs text-mist-600">
        <span>{post.upvotes} upvotes</span>
        <span>{post.commentsCount} comments</span>
      </div>

      {post.reports.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-mist-600">
            <FlagFilled className="text-danger" /> Reports ({post.reports.length})
          </div>
          <div className="space-y-2">
            {post.reports.map((report) => (
              <div key={report.id} className="rounded-lg border border-danger/20 bg-danger/[0.06] p-3 text-xs">
                <div className="text-mist-300">{report.reason}</div>
                <div className="mt-1 text-mist-600">
                  Reported by {report.reportedBy} · {formatDateTime(report.reportedAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 border-t border-navy-700/60 pt-4">
        {post.status === "reported" && (
          <>
            <Button icon={<CheckCircleOutlined />} block onClick={() => onDismissReport(post)}>
              Dismiss report — keep post live
            </Button>
            <Popconfirm
              title="Remove this post?"
              description="It will be taken down from the forum and marked as removed."
              okText="Remove post"
              okButtonProps={{ danger: true }}
              onConfirm={() => onRemovePost(post)}
            >
              <Button danger icon={<DeleteOutlined />} block>
                Remove post
              </Button>
            </Popconfirm>
          </>
        )}

        {post.status === "removed" && (
          <>
            <Button icon={<UndoOutlined />} block onClick={() => onRestorePost(post)}>
              Restore post
            </Button>
            <Popconfirm
              title="Delete permanently?"
              description="This erases the post record entirely. This can't be undone."
              okText="Delete permanently"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDeletePermanently(post)}
            >
              <Button danger icon={<DeleteOutlined />} block>
                Delete permanently
              </Button>
            </Popconfirm>
          </>
        )}

        {post.status === "published" && (
          <Popconfirm
            title="Remove this post?"
            description="It will be taken down from the forum and marked as removed."
            okText="Remove post"
            okButtonProps={{ danger: true }}
            onConfirm={() => onRemovePost(post)}
          >
            <Button danger icon={<DeleteOutlined />} block>
              Remove post
            </Button>
          </Popconfirm>
        )}
      </div>
    </Drawer>
  );
}
