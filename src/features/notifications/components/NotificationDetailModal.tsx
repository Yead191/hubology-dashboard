import { Avatar, Button, Modal } from "antd";
import {
  BellOutlined,
  CheckOutlined,
  DeleteOutlined,
  ExportOutlined,
  UserOutlined,
  CalendarOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { NotificationItem } from "@/redux/features/notification/notificationApi";
import { StatusTag } from "@/components/ui/StatusTag";
import { getImageUrl } from "@/lib/getImageUrl";
import { resolveNotificationPath } from "@/lib/notificationPath";
import { formatDateTime } from "@/lib/utils";

interface NotificationDetailModalProps {
  notification: NotificationItem | null;
  open: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDelete: (notification: NotificationItem) => void;
  onNavigate: (path?: string, refId?: string) => void;
}

export function NotificationDetailModal({
  notification,
  open,
  onClose,
  onMarkAsRead,
  onDelete,
  onNavigate,
}: NotificationDetailModalProps) {
  if (!notification) return null;

  const targetPath = resolveNotificationPath(notification.path, notification.refId);
  const unread = !notification.seen;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={560}
      footer={null}
      title={
        <div className="flex items-center gap-3 pr-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 text-violet-glow">
            <BellOutlined className="text-lg" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-display text-base font-semibold text-cloud-100">
              Notification Details
            </h3>
            <div className="flex items-center gap-2 text-xs text-mist-400">
              <CalendarOutlined className="text-[11px]" />
              <span>{formatDateTime(notification.createdAt)}</span>
            </div>
          </div>
        </div>
      }
      className="hubology-modal"
    >
      <div className="mt-4 space-y-4">
        {/* Status and Title header card */}
        <div className="rounded-xl border border-navy-700/70 bg-navy-800/60 p-4">
          <div className="flex items-center justify-between gap-2">
            <StatusTag tone={unread ? "warning" : "success"}>
              {unread ? "Unread" : "Read / Seen"}
            </StatusTag>
            <span className="text-xs text-mist-500 font-mono">
              ID: {notification._id.slice(-8)}
            </span>
          </div>
          <h4 className="mt-2.5 font-display text-lg font-semibold text-cloud-100">
            {notification.title}
          </h4>
        </div>

        {/* Message body */}
        <div className="rounded-xl border border-navy-700/60 bg-navy-850/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-mist-500">
            Message
          </p>
          <p className="mt-2 text-sm leading-relaxed text-cloud-100 whitespace-pre-wrap">
            {notification.message || "No detailed message provided with this notification."}
          </p>
        </div>

        {/* Sender details if available */}
        <div className="rounded-xl border border-navy-700/60 bg-navy-850/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-mist-500 mb-2.5">
            Sender Information
          </p>
          <div className="flex items-center gap-3">
            <Avatar
              src={getImageUrl(notification.sender?.image)}
              icon={!notification.sender?.image ? <UserOutlined /> : undefined}
              size={40}
              className="bg-navy-700 text-mist-400"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-cloud-100 truncate">
                {notification.sender?.name || "Hubology System Alert"}
              </p>
              <p className="text-xs text-mist-400 truncate">
                {notification.sender?.email || "Automated Platform Event"}
              </p>
            </div>
          </div>
        </div>

        {/* Destination Path banner */}
        {targetPath && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-sky-500/30 bg-sky-950/20 p-3.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <LinkOutlined className="text-sky-400 shrink-0 text-base" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-sky-300">
                  Target Resource
                </p>
                <p className="truncate text-xs font-mono text-mist-400">
                  {notification.path}
                </p>
              </div>
            </div>
            <Button
              type="primary"
              size="small"
              icon={<ExportOutlined />}
              onClick={() => {
                onClose();
                onNavigate(notification.path, notification.refId);
              }}
              className="bg-linear-to-r from-sky-500 to-sky-600! font-medium shrink-0"
            >
              Open link
            </Button>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex items-center justify-between border-t border-navy-700/60 pt-4">
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => {
              onClose();
              onDelete(notification);
            }}
            className="hover:bg-danger/10! text-mist-400 hover:text-danger!"
          >
            Delete
          </Button>

          <div className="flex items-center gap-2">
            {unread && (
              <Button
                type="default"
                icon={<CheckOutlined />}
                onClick={() => onMarkAsRead(notification._id)}
                className="border-navy-600! text-mist-300! hover:text-cloud-100! hover:border-violet-500!"
              >
                Mark as read
              </Button>
            )}
            <Button
              type="primary"
              onClick={onClose}
              className="bg-linear-to-r from-[#8131F0] to-[#4A1C8A]!"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
