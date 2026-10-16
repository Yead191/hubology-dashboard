import { type ReactNode, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, Skeleton, Tooltip } from "antd";
import {
  ArrowLeftOutlined,
  BankOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  CopyOutlined,
  CrownOutlined,
  DeleteOutlined,
  EyeOutlined,
  GlobalOutlined,
  IdcardOutlined,
  MailOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  UserOutlined,
  CheckOutlined,
  AimOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { toast } from "sonner";
import { GlassCard } from "@/components/ui/GlassCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusTag } from "@/components/ui/StatusTag";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { useConfirmDelete } from "@/hooks/useConfirmDelete";
import { cn, formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  useChangeUserStatusMutation,
  useDeleteUserMutation,
  useGetUserByIdQuery,
} from "@/redux/features/users/usersApi";
import type { ApiUser, UserAccountStatus } from "@/redux/features/users/users.types";
import {
  subscriptionStatusToneMap,
  userStatusDotClassMap,
  userStatusLabelMap,
  userStatusToneMap,
} from "./statusMaps";
import { UserStatusSelect } from "./components/UserStatusSelect";

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const err = error as { data?: { message?: string }; message?: string };
    return err.data?.message ?? err.message ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export default function UserDetailPage() {
  const { userId = "" } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const {
    data: userRes,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetUserByIdQuery(userId, { skip: !userId });

  const [changeStatus, { isLoading: isChangingStatus }] = useChangeUserStatusMutation();
  const [deleteUser] = useDeleteUserMutation();

  const user = userRes?.data;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const deleteFlow = useConfirmDelete<ApiUser>(async (record) => {
    const promise = deleteUser(record._id)
      .unwrap()
      .then(() => {
        navigate("/users");
      });

    toast.promise(promise, {
      loading: `Deleting ${record.name}…`,
      success: `${record.name}'s account has been permanently removed.`,
      error: (err) => getErrorMessage(err),
    });

    await promise.catch(() => undefined);
  });

  const handleStatusChange = (newStatus: UserAccountStatus) => {
    if (!user) return;
    const promise = changeStatus({
      id: user._id,
      body: { status: newStatus },
    }).unwrap();

    toast.promise(promise, {
      loading: `Updating ${user.name}'s status…`,
      success: `${user.name} is now ${userStatusLabelMap[newStatus].toLowerCase()}.`,
      error: (err) => getErrorMessage(err),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/users")}
            className="text-mist-400 hover:text-cloud-100"
          >
            Back to users
          </Button>
        </div>

        <GlassCard className="p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <Skeleton.Avatar active size={96} shape="square" className="rounded-2xl" />
            <div className="flex-1 space-y-3">
              <Skeleton.Input active size="large" style={{ width: 260 }} />
              <Skeleton.Input active size="small" style={{ width: 180 }} />
              <div className="flex gap-2 pt-2">
                <Skeleton.Button active size="small" style={{ width: 90 }} />
                <Skeleton.Button active size="small" style={{ width: 90 }} />
              </div>
            </div>
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <GlassCard className="p-6">
              <Skeleton active paragraph={{ rows: 6 }} />
            </GlassCard>
          </div>
          <div className="space-y-6">
            <GlassCard className="p-6">
              <Skeleton active paragraph={{ rows: 4 }} />
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/users")}
          className="text-mist-400 hover:text-cloud-100"
        >
          Back to users
        </Button>

        <GlassCard className="py-16 text-center">
          <EmptyState
            icon={<UserOutlined className="text-4xl" />}
            title="User Not Found"
            description="The requested user account does not exist or has been removed from the platform."
            actionLabel="Return to Users"
            onAction={() => navigate("/users")}
          />
        </GlassCard>
      </div>
    );
  }

  const subscription =
    user.subscription &&
    typeof user.subscription === "object" &&
    "name" in user.subscription
      ? user.subscription
      : null;
  const isBlocked = user.status === "blocked";

  return (
    <div className="space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/users")}
            className="!text-mist-400 hover:!bg-white/5 hover:!text-cloud-100"
          >
            Users
          </Button>
          <span className="text-mist-600">/</span>
          <span className="font-medium text-cloud-100">{user.name}</span>
        </div>

        <div className="flex items-center gap-2.5">
          <Tooltip title="Refresh user details">
            <Button
              type="text"
              icon={<ReloadOutlined className={isFetching ? "animate-spin text-violet-glow" : ""} />}
              onClick={() => void refetch()}
              disabled={isFetching}
              className="!text-mist-400 hover:!bg-white/5 hover:!text-cloud-100"
            />
          </Tooltip>

          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteFlow.request(user)}
            className="border-danger/30! bg-danger/10! text-danger! hover:bg-danger/20!"
          >
            Delete user
          </Button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-navy-700/80 bg-linear-to-b from-[#181c3d] via-[#121530] to-[#0c0e22] p-6 shadow-2xl md:p-8">
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-600/15 blur-[90px]" />
        <div className="pointer-events-none absolute left-1/3 top-0 h-48 w-48 rounded-full bg-fuchsia-600/10 blur-[80px]" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {/* Avatar with Glow and Badges */}
            <div className="relative shrink-0">
              <div className="rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-600 to-fuchsia-600 p-[2.5px] shadow-[0_12px_40px_-10px_rgba(129,49,240,0.7)]">
                <Avatar
                  src={getImageUrl(user.image)}
                  icon={<UserOutlined />}
                  size={96}
                  shape="square"
                  className="!rounded-[14px] !bg-navy-900 object-cover text-3xl"
                />
              </div>

              {user.verified && (
                <Tooltip title="Email Verified Account">
                  <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#121530] bg-info text-white shadow-md">
                    <CheckCircleFilled className="text-xs" />
                  </span>
                </Tooltip>
              )}
            </div>

            {/* User Title & Info */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold tracking-tight text-cloud-100 sm:text-3xl">
                  {user.name}
                </h1>
                {user.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-info/30 bg-info/10 px-2.5 py-0.5 text-xs font-medium text-info">
                    <CheckCircleFilled className="text-[11px]" /> Verified
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-mist-400">
                <span className="flex items-center gap-1.5">
                  <IdcardOutlined className="text-mist-500" />
                  <span className="capitalize text-mist-300 font-medium">{user.role || "User"}</span>
                </span>
                {user.company && (
                  <>
                    <span className="text-mist-600">•</span>
                    <span className="flex items-center gap-1.5 text-mist-300">
                      <BankOutlined className="text-mist-500" />
                      {user.company}
                    </span>
                  </>
                )}
                {user.interest && (
                  <>
                    <span className="text-mist-600">•</span>
                    <span className="flex items-center gap-1.5 text-violet-glow font-medium">
                      <AimOutlined className="text-violet-400" />
                      {user.interest}
                    </span>
                  </>
                )}
              </div>

              {/* Badges / Status row */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusTag tone={userStatusToneMap[user.status]}>
                  <span className={cn("mr-1.5 inline-block h-2 w-2 rounded-full", userStatusDotClassMap[user.status])} />
                  {userStatusLabelMap[user.status]}
                </StatusTag>

                {subscription ? (
                  <StatusTag tone="gold" icon={<CrownOutlined />}>
                    {subscription.name} Member
                  </StatusTag>
                ) : (
                  <StatusTag tone="neutral">Standard Member</StatusTag>
                )}

                <Tooltip title="Click to copy full ID">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(user._id, "User ID")}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-navy-700 bg-navy-800/80 px-3 py-1 font-mono text-xs text-mist-400 transition hover:border-violet-500/40 hover:text-cloud-100"
                  >
                    <span>ID: {user._id}</span>
                    <CopyOutlined className="text-[11px] group-hover:text-violet-glow" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Quick Status Control on Header */}
          <div className="flex flex-col gap-2 rounded-2xl border border-navy-700/80 bg-navy-850/80 p-3.5 sm:min-w-[200px]">
            <div className="flex items-center justify-between text-xs text-mist-400">
              <span className="font-medium uppercase tracking-wider text-[11px] text-mist-500">
                Access Status
              </span>
              <span className={cn("font-medium", isBlocked ? "text-danger" : "text-success")}>
                {userStatusLabelMap[user.status]}
              </span>
            </div>
            <UserStatusSelect
              value={user.status}
              disabled={isChangingStatus}
              onChange={handleStatusChange}
              size="middle"
            />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 cols): Details & Subscription */}
        <div className="space-y-6 lg:col-span-2">
          {/* Account Details Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between border-b border-navy-700/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600/20 text-violet-glow">
                  <UserOutlined />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-cloud-100">
                    Account Information
                  </h2>
                  <p className="text-xs text-mist-400">Profile and identity attributes</p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField
                label="Full Name"
                value={user.name}
                icon={<UserOutlined />}
              />

              <DetailField
                label="Email Address"
                value={user.email}
                icon={<MailOutlined />}
                action={
                  <div className="flex items-center gap-1.5">
                    <Tooltip title="Send email">
                      <a
                        href={`mailto:${user.email}`}
                        className="rounded p-1 text-mist-400 hover:bg-violet-600/15 hover:text-violet-glow"
                      >
                        <MailOutlined className="text-xs" />
                      </a>
                    </Tooltip>
                    <Tooltip title="Copy email">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(user.email, "Email")}
                        className="rounded p-1 text-mist-400 hover:bg-white/10 hover:text-cloud-100"
                      >
                        {copiedField === "Email" ? (
                          <CheckOutlined className="text-xs text-success" />
                        ) : (
                          <CopyOutlined className="text-xs" />
                        )}
                      </button>
                    </Tooltip>
                  </div>
                }
              />

              <DetailField
                label="Company / Agency"
                value={user.company || "Not specified"}
                icon={<BankOutlined />}
              />

              <DetailField
                label="Primary Interest"
                value={user.interest || "Not specified"}
                icon={<AimOutlined />}
              />

              <DetailField
                label="Registration Date"
                value={formatDate(user.createdAt)}
                subValue={user.createdAt ? formatDateTime(user.createdAt) : undefined}
                icon={<CalendarOutlined />}
              />

              <DetailField
                label="Last Profile Update"
                value={formatDate(user.updatedAt)}
                subValue={user.updatedAt ? formatDateTime(user.updatedAt) : undefined}
                icon={<CalendarOutlined />}
              />
            </div>
          </GlassCard>

          {/* Subscription & Membership Tier Card */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between border-b border-navy-700/60 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f5b544]/20 text-[#f5b544]">
                  <CrownOutlined />
                </div>
                <div>
                  <h2 className="font-display text-base font-semibold text-cloud-100">
                    Membership & Subscription
                  </h2>
                  <p className="text-xs text-mist-400">Current active plan and benefits</p>
                </div>
              </div>

              {subscription && (
                <StatusTag tone={subscriptionStatusToneMap[subscription.status] ?? "neutral"}>
                  {subscription.status}
                </StatusTag>
              )}
            </div>

            {subscription ? (
              <div className="mt-5 space-y-4">
                <div className="relative overflow-hidden rounded-2xl border border-[#f5b544]/30 bg-linear-to-br from-[#f5b544]/15 via-[#f5b544]/5 to-transparent p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-[#f5b544]/20 p-1.5 text-[#f5b544]">
                          <CrownOutlined className="text-base" />
                        </span>
                        <h3 className="font-display text-lg font-bold text-cloud-100">
                          {subscription.name}
                        </h3>
                      </div>
                      <p className="mt-1 text-xs text-mist-300">
                        Recurring cycle: <span className="capitalize font-semibold text-cloud-100">{subscription.recuring}</span>
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <div className="font-display text-2xl font-bold text-[#f5b544]">
                        {formatCurrency(subscription.price)}
                        <span className="text-xs font-normal text-mist-400">
                          /{subscription.recuring}
                        </span>
                      </div>
                      <span className="text-xs text-mist-400">
                        Billing rate
                      </span>
                    </div>
                  </div>

                  {/* Dates Bar */}
                  <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#f5b544]/20 pt-4 sm:grid-cols-2">
                    <div className="flex items-center gap-2.5 text-xs text-mist-300">
                      <CalendarOutlined className="text-[#f5b544]" />
                      <div>
                        <span className="text-mist-500 block text-[11px]">Subscribed On</span>
                        <span className="font-medium text-cloud-100">
                          {formatDate(subscription.start_date)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-mist-300">
                      <CalendarOutlined className="text-[#f5b544]" />
                      <div>
                        <span className="text-mist-500 block text-[11px]">Renews / Ends On</span>
                        <span className="font-medium text-cloud-100">
                          {formatDate(subscription.end_date)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features List */}
                {subscription.features && subscription.features.length > 0 && (
                  <div className="rounded-2xl border border-navy-700/60 bg-navy-800/40 p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-mist-400 mb-3">
                      Plan Inclusions & Features
                    </h4>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {subscription.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-xs text-mist-200"
                        >
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/20 text-success text-[10px]">
                            <CheckOutlined />
                          </span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-700/70 bg-navy-850/30 p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-800 text-mist-500">
                  <CrownOutlined className="text-xl" />
                </div>
                <h3 className="mt-3 font-display text-sm font-semibold text-cloud-100">
                  No Active Subscription
                </h3>
                <p className="mt-1 max-w-sm text-xs text-mist-400">
                  This user is currently on the free standard tier and has no active membership plan.
                </p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column (1 col): Administrative Actions & Quick Tools */}
        <div className="space-y-6">
          {/* Quick Admin Actions */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2.5 border-b border-navy-700/60 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                <ThunderboltOutlined />
              </div>
              <div>
                <h2 className="font-display text-base font-semibold text-cloud-100">
                  Quick Actions
                </h2>
                <p className="text-xs text-mist-400">Account management controls</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {/* Toggle Status Button */}
              <button
                type="button"
                disabled={isChangingStatus}
                onClick={() => handleStatusChange(isBlocked ? "active" : "blocked")}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition",
                  isBlocked
                    ? "border-success/30 bg-success/10 hover:bg-success/15 text-success"
                    : "border-danger/30 bg-danger/10 hover:bg-danger/15 text-danger"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {isBlocked ? <UnlockOutlined /> : <LockOutlined />}
                  </span>
                  <div>
                    <p className="text-xs font-semibold">
                      {isBlocked ? "Unblock Account" : "Block User Account"}
                    </p>
                    <p className="text-[11px] opacity-80">
                      {isBlocked ? "Restore full platform access" : "Prevent user from logging in"}
                    </p>
                  </div>
                </div>
              </button>

              {/* Direct Mail */}
              <a
                href={`mailto:${user.email}`}
                className="flex w-full items-center justify-between rounded-xl border border-navy-700/70 bg-navy-800/60 p-3.5 text-left text-mist-300 transition hover:border-violet-600/40 hover:text-cloud-100 hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <MailOutlined className="text-violet-glow text-base" />
                  <div>
                    <p className="text-xs font-semibold text-cloud-100">Email User</p>
                    <p className="text-[11px] text-mist-400">Open default mail client</p>
                  </div>
                </div>
              </a>

              {/* Copy Full User ID */}
              <button
                type="button"
                onClick={() => copyToClipboard(user._id, "User ID")}
                className="flex w-full items-center justify-between rounded-xl border border-navy-700/70 bg-navy-800/60 p-3.5 text-left text-mist-300 transition hover:border-violet-600/40 hover:text-cloud-100 hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <CopyOutlined className="text-violet-glow text-base" />
                  <div>
                    <p className="text-xs font-semibold text-cloud-100">Copy User ID</p>
                    <p className="text-[11px] text-mist-400 font-mono truncate max-w-[180px]">
                      {user._id}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </GlassCard>

          {/* System & Security Meta Card */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2.5 border-b border-navy-700/60 pb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600/20 text-sky-400">
                <SafetyCertificateOutlined />
              </div>
              <div>
                <h2 className="font-display text-base font-semibold text-cloud-100">
                  System Security
                </h2>
                <p className="text-xs text-mist-400">Authentication & credentials</p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-navy-700/60 bg-navy-800/30 p-3">
                <span className="text-mist-400">Account Type</span>
                <span className="font-semibold uppercase tracking-wider text-cloud-100">
                  {user.role}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-navy-700/60 bg-navy-800/30 p-3">
                <span className="text-mist-400">Verification</span>
                <span className={cn("font-medium flex items-center gap-1", user.verified ? "text-info" : "text-warning")}>
                  {user.verified ? (
                    <>
                      <CheckCircleFilled /> Verified
                    </>
                  ) : (
                    "Unverified"
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-navy-700/60 bg-navy-800/30 p-3">
                <span className="text-mist-400">Account Status</span>
                <span className={cn("font-semibold capitalize", isBlocked ? "text-danger" : "text-success")}>
                  {user.status}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Confirmation Delete Dialog */}
      <ConfirmDeleteModal
        open={deleteFlow.isOpen}
        title={`Delete ${deleteFlow.target?.name}?`}
        description="This permanently removes the user account from Hubology. This action cannot be reversed."
        confirmLabel="Delete user account"
        loading={deleteFlow.loading}
        onConfirm={deleteFlow.confirm}
        onCancel={deleteFlow.cancel}
      />
    </div>
  );
}

function DetailField({
  label,
  value,
  subValue,
  icon,
  action,
}: {
  label: string;
  value: ReactNode;
  subValue?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-navy-700/60 bg-navy-800/40 p-4 transition hover:border-navy-600/80 hover:bg-navy-800/60">
      <div className="flex items-center justify-between text-xs text-mist-400">
        <span className="flex items-center gap-1.5 font-medium text-mist-500">
          {icon && <span className="text-violet-glow/80">{icon}</span>}
          {label}
        </span>
        {action}
      </div>
      <div className="mt-2 text-sm font-semibold text-cloud-100 break-words">
        {value}
      </div>
      {subValue && (
        <div className="mt-0.5 text-[11px] text-mist-500">
          {subValue}
        </div>
      )}
    </div>
  );
}
