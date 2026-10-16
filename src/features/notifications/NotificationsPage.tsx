import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Pagination, Spin, Tabs, Tooltip } from "antd";
import {
  BellOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined,
  ReloadOutlined,
  UserOutlined,
  LinkOutlined,
  ExclamationCircleOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { io, type Socket } from "socket.io-client";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusTag } from "@/components/ui/StatusTag";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import {
  useGetAllNotificationsQuery,
  useReadAllNotificationsMutation,
  useReadNotificationMutation,
  useDeleteNotificationMutation,
  type NotificationItem,
} from "@/redux/features/notification/notificationApi";
import { SOCKET_URL, TOKEN_KEY } from "@/config";
import { getImageUrl } from "@/lib/getImageUrl";
import { resolveNotificationPath } from "@/lib/notificationPath";
import { cn, formatDateTime, formatDate } from "@/lib/utils";
import { NotificationDetailModal } from "./components/NotificationDetailModal";

type FilterTab = "all" | "unread" | "read";

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 45) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { data: profile } = useGetProfileQuery();
  const userId = profile?.data?._id;

  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  const {
    value: searchInput,
    setValue: setSearchInput,
    debouncedValue: searchTerm,
  } = useDebouncedSearch(300);

  // Fetch paginated notification history
  const {
    data: notificationRes,
    refetch,
    isFetching,
    isLoading,
  } = useGetAllNotificationsQuery({ page, limit });

  const [readNotification, { isLoading: isReadingOne }] =
    useReadNotificationMutation();
  const [readAllNotifications, { isLoading: isReadingAll }] =
    useReadAllNotificationsMutation();
  const [deleteNotification] = useDeleteNotificationMutation();

  const rawNotifications = notificationRes?.data?.data ?? [];
  const unreadCount = notificationRes?.data?.unreadCount ?? 0;
  const pagination = notificationRes?.pagination;
  const totalCount = pagination?.total ?? rawNotifications.length;

  // Real-time socket sync
  useEffect(() => {
    if (!userId) return;

    const socket: Socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token: localStorage.getItem(TOKEN_KEY),
      },
    });

    const eventName = `getNotification::${userId}`;
    const handleNewNotification = () => {
      void refetch();
    };

    socket.on(eventName, handleNewNotification);

    return () => {
      socket.off(eventName, handleNewNotification);
      socket.disconnect();
    };
  }, [refetch, userId]);

  // Client-side search & status filtering
  const filteredNotifications = useMemo(() => {
    return rawNotifications.filter((item) => {
      // Tab filter
      if (activeTab === "unread" && item.seen) return false;
      if (activeTab === "read" && !item.seen) return false;

      // Text search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(query);
        const msgMatch = item.message?.toLowerCase().includes(query);
        const senderMatch = item.sender?.name?.toLowerCase().includes(query);
        return titleMatch || msgMatch || senderMatch;
      }

      return true;
    });
  }, [rawNotifications, activeTab, searchTerm]);

  // Dynamic status tab counts from current batch
  const readCount = Math.max(0, totalCount - unreadCount);
  const linkedCount = useMemo(
    () => rawNotifications.filter((n) => Boolean(n.path)).length,
    [rawNotifications],
  );

  // Confirm delete flow
  const deleteFlow = useConfirmDelete<NotificationItem>(async (item) => {
    try {
      await deleteNotification(item._id).unwrap();
      toast.success("Notification deleted successfully.");
      if (selectedNotification?._id === item._id) {
        setSelectedNotification(null);
      }
    } catch {
      toast.error("Failed to delete notification. Please try again.");
    }
  });

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await readNotification({ id }).unwrap();
      toast.success("Notification marked as read.");
    } catch {
      toast.error("Could not update notification status.");
    }
  };

  const handleReadAll = () => {
    if (unreadCount === 0) return;
    toast.promise(readAllNotifications().unwrap(), {
      loading: "Marking all as read…",
      success: "All notifications marked as read.",
      error: "Couldn't update notifications.",
    });
  };

  const handleItemClick = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    if (!notification.seen) {
      void readNotification({ id: notification._id });
    }
  };

  const handleNavigatePath = (path?: string, refId?: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const resolved = resolveNotificationPath(path, refId);
    if (resolved) {
      navigate(resolved);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Notifications"
          value={totalCount}
          icon={<BellOutlined className="text-xl" />}
          tone="violet"
        />
        <StatCard
          label="Unread Alerts"
          value={unreadCount}
          icon={<ExclamationCircleOutlined className="text-xl" />}
          tone={unreadCount > 0 ? "warning" : "neutral"}
        />
        <StatCard
          label="Read / History"
          value={readCount}
          icon={<CheckCircleOutlined className="text-xl" />}
          tone="success"
        />
        <StatCard
          label="Linked Resources"
          value={linkedCount}
          icon={<LinkOutlined className="text-xl" />}
          tone="info"
        />
      </div>

      {/* Main GlassCard Container */}
      <GlassCard className="p-4 md:p-6">
        {/* Controls Header */}
        <div className="flex flex-col gap-4 border-b border-navy-700/60 pb-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              activeKey={activeTab}
              onChange={(key) => {
                setActiveTab(key as FilterTab);
                setPage(1);
              }}
              items={[
                {
                  key: "all",
                  label: (
                    <span className="flex items-center gap-2 font-medium">
                      All Notifications
                      <span className="rounded-full bg-navy-700 px-2 py-0.5 text-xs text-mist-300">
                        {totalCount}
                      </span>
                    </span>
                  ),
                },
                {
                  key: "unread",
                  label: (
                    <span className="flex items-center gap-2 font-medium">
                      Unread
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-semibold",
                          unreadCount > 0
                            ? "bg-violet-600/30 text-violet-glow"
                            : "bg-navy-700 text-mist-400",
                        )}
                      >
                        {unreadCount}
                      </span>
                    </span>
                  ),
                },
                {
                  key: "read",
                  label: (
                    <span className="flex items-center gap-2 font-medium">
                      Read History
                      <span className="rounded-full bg-navy-700 px-2 py-0.5 text-xs text-mist-300">
                        {readCount}
                      </span>
                    </span>
                  ),
                },
              ]}
              className="hubology-tabs"
            />
          </div>

          {/* Action buttons & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="w-full sm:w-64">
              <SearchInput
                value={searchInput}
                onChange={setSearchInput}
                placeholder="Search notifications…"
              />
            </div>

            <Button
              type="default"
              icon={<CheckOutlined />}
              onClick={handleReadAll}
              disabled={unreadCount === 0 || isReadingAll}
              loading={isReadingAll}
              className="border-navy-600! bg-navy-800/60! text-mist-300! hover:border-violet-500! hover:text-cloud-100! disabled:opacity-40!"
            >
              Mark all as read
            </Button>

            <Tooltip title="Refresh list">
              <Button
                type="text"
                icon={
                  <ReloadOutlined
                    className={
                      isFetching ? "animate-spin text-violet-glow" : ""
                    }
                  />
                }
                onClick={() => void refetch()}
                disabled={isFetching}
                className="text-mist-400 hover:bg-white/5 hover:text-cloud-100"
              />
            </Tooltip>
          </div>
        </div>

        {/* Notifications List */}
        <div className="mt-5 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spin size="large" />
              <p className="mt-4 text-sm text-mist-400">
                Loading notifications…
              </p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-16">
              <EmptyState
                icon={<InboxOutlined className="text-4xl" />}
                title={
                  searchTerm
                    ? "No matching notifications"
                    : activeTab === "unread"
                      ? "No unread notifications"
                      : "No notifications found"
                }
                description={
                  searchTerm
                    ? `No notifications found matching "${searchTerm}". Try clearing your search.`
                    : activeTab === "unread"
                      ? "You are all caught up! There are no unread notifications right now."
                      : "Your notification history is empty. New alerts will show up here."
                }
                actionLabel={searchTerm ? "Clear search" : undefined}
                onAction={searchTerm ? () => setSearchInput("") : undefined}
              />
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const unread = !item.seen;
              const hasPath = Boolean(item.path);
              const targetPath = resolveNotificationPath(item.path, item.refId);

              return (
                <div
                  key={item._id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "group relative flex flex-col gap-4 rounded-2xl border p-4 transition-all duration-200 cursor-pointer sm:flex-row sm:items-center sm:justify-between md:p-5",
                    unread
                      ? "border-violet-500/35 bg-violet-950/15 shadow-[0_4px_25px_-10px_rgba(129,49,240,0.25)] hover:border-violet-500/60 hover:bg-violet-900/20"
                      : "border-navy-700/60 bg-navy-800/40 hover:border-navy-600/80 hover:bg-navy-800/70",
                  )}
                >
                  {/* Left info area */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Unread indicator */}
                    <div className="pt-2">
                      <span
                        className={cn(
                          "block h-2.5 w-2.5 rounded-full transition-all",
                          unread
                            ? "bg-violet-glow shadow-[0_0_10px_rgba(157,92,245,0.85)] scale-110"
                            : "bg-navy-600 opacity-40",
                        )}
                      />
                    </div>

                    {/* Sender Avatar / Icon */}
                    {/* <Avatar
                      src={getImageUrl(item.sender?.image)}
                      icon={!item.sender?.image ? <UserOutlined /> : undefined}
                      size={42}
                      className={cn(
                        "shrink-0 rounded-xl",
                        unread
                          ? "bg-violet-600/30 text-violet-glow ring-2 ring-violet-500/30"
                          : "bg-navy-700/80 text-mist-400",
                      )}
                    /> */}

                    {/* Text content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={cn(
                            "font-display text-[15px] font-semibold leading-snug",
                            unread ? "text-cloud-100" : "text-mist-200",
                          )}
                        >
                          {item.title}
                        </h4>

                        {unread && (
                          <span className="rounded-full bg-violet-600/30 px-2 py-0.5 text-[10px] font-semibold text-violet-glow uppercase tracking-wider">
                            New
                          </span>
                        )}

                        {hasPath && (
                          <StatusTag tone="info" icon={<LinkOutlined />}>
                            {item.path}
                          </StatusTag>
                        )}
                      </div>

                      {item.message && (
                        <p className="mt-1 text-[13px] leading-relaxed text-mist-400 line-clamp-2">
                          {item.message}
                        </p>
                      )}

                      {/* Metadata bar */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-mist-500">
                        <span>
                          {item.sender?.name ? (
                            <span className="text-mist-300 font-medium">
                              {item.sender.name}
                            </span>
                          ) : (
                            "Hubology System"
                          )}
                        </span>
                        <span>•</span>
                        <Tooltip title={formatDateTime(item.createdAt)}>
                          <span className="cursor-help underline decoration-dotted decoration-mist-600 underline-offset-2">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>

                  {/* Right actions */}
                  <div
                    className="flex shrink-0 items-center gap-1.5 self-end sm:self-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {unread && (
                      <Tooltip title="Mark as read">
                        <Button
                          size="small"
                          type="text"
                          icon={<CheckOutlined />}
                          onClick={(e) => handleMarkAsRead(item._id, e)}
                          disabled={isReadingOne}
                          className="h-8 w-8 rounded-lg text-mist-400 hover:bg-violet-600/20 hover:text-violet-glow"
                        />
                      </Tooltip>
                    )}

                    {targetPath && (
                      <Tooltip title="Open related resource">
                        <Button
                          size="small"
                          type="text"
                          icon={<ExportOutlined />}
                          onClick={(e) => handleNavigatePath(item.path, item.refId, e)}
                          className="h-8 w-8 rounded-lg text-mist-400 hover:bg-sky-500/15 hover:text-sky-400"
                        />
                      </Tooltip>
                    )}

                    <Tooltip title="View details">
                      <Button
                        size="small"
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => setSelectedNotification(item)}
                        className="h-8 w-8 rounded-lg text-mist-400 hover:bg-white/5 hover:text-cloud-100"
                      />
                    </Tooltip>

                    <Tooltip title="Delete notification">
                      <Button
                        size="small"
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => deleteFlow.request(item)}
                        className="h-8 w-8 rounded-lg text-mist-500 hover:bg-danger/15 hover:text-danger"
                      />
                    </Tooltip>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Pagination */}
        {totalCount > 0 && (
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-navy-700/60 pt-5 sm:flex-row">
            <div className="text-xs text-mist-400">
              Showing{" "}
              <span className="font-medium text-cloud-100">
                {filteredNotifications.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-cloud-100">{totalCount}</span>{" "}
              notifications
            </div>

            <Pagination
              current={page}
              pageSize={limit}
              total={totalCount}
              onChange={(nextPage, nextSize) => {
                setPage(nextPage);
                setLimit(nextSize);
              }}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
              className="hubology-pagination"
            />
          </div>
        )}
      </GlassCard>

      {/* Interactive Detail Modal */}
      <NotificationDetailModal
        notification={selectedNotification}
        open={Boolean(selectedNotification)}
        onClose={() => setSelectedNotification(null)}
        onMarkAsRead={(id) => handleMarkAsRead(id)}
        onDelete={(item) => deleteFlow.request(item)}
        onNavigate={(path, refId) => handleNavigatePath(path, refId)}
      />

      {/* Confirmation Delete Dialog */}
      <ConfirmDeleteModal
        open={deleteFlow.isOpen}
        title="Delete Notification?"
        description="Are you sure you want to delete this notification? This action cannot be undone."
        confirmLabel="Delete notification"
        loading={deleteFlow.loading}
        onConfirm={deleteFlow.confirm}
        onCancel={deleteFlow.cancel}
      />
    </div>
  );
}
