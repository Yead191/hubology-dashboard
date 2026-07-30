import { Avatar, Badge, Dropdown, Input, type MenuProps } from "antd";
import {
  BellOutlined,
  SearchOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import { useForum } from "@/features/forum/ForumContext";
import { toast } from "sonner";
import { useGetProfileQuery } from "@/redux/features/auth/authApi";
import { useGetDashboardOverviewQuery } from "@/redux/features/dashboard/dashboardApi";
import { getImageUrl } from "@/lib/getImageUrl";

export function Topbar({ title, subtitle, onOpenMobileNav }: { title: string; subtitle?: string; onOpenMobileNav?: () => void }) {
  const { logout } = useAuth();
  const { data: profile } = useGetProfileQuery({});
  const { data: dashboardRes } = useGetDashboardOverviewQuery();
  const user = profile?.data;
  const navigate = useNavigate();
  const { posts } = useForum();

  const pendingVendors = dashboardRes?.data?.pendingVendors ?? 0;
  const reportedPosts = posts.filter((p) => p.status === "reported").length;
  const alertCount = pendingVendors + reportedPosts;

  const handleLogout = () => {
    logout();
    toast.message("Signed out", { description: "You've been logged out of Hubology admin." });
    navigate("/login", { replace: true });
  };

  const userMenuItems: MenuProps["items"] = [
    { key: "profile", label: "Signed in as " + (user?.email ?? ""), disabled: true },
    { type: "divider" },
    { key: "logout", label: "Sign out", icon: <LogoutOutlined />, danger: true, onClick: handleLogout },
  ];

  const notifItems: MenuProps["items"] = [
    {
      key: "vendors",
      label: (
        <div className="flex items-center justify-between gap-6 py-0.5">
          <span>Pending vendor applications</span>
          <span className="font-semibold text-cloud-100">{pendingVendors}</span>
        </div>
      ),
      onClick: () => navigate("/vendors"),
    },
    {
      key: "forum",
      label: (
        <div className="flex items-center justify-between gap-6 py-0.5">
          <span>Reported forum posts</span>
          <span className="font-semibold text-cloud-100">{reportedPosts}</span>
        </div>
      ),
      onClick: () => navigate("/forum"),
    },
  ];

  return (
    <div className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-navy-700/60 bg-navy-900/75 px-4 backdrop-blur-xl md:px-6">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="rounded-lg p-2 text-mist-400 hover:bg-white/5 hover:text-cloud-100 md:hidden"
        aria-label="Open navigation"
      >
        <MenuOutlined />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-[17px] font-semibold text-cloud-100">{title}</h1>
        {subtitle && <p className="hidden truncate text-xs text-mist-400 sm:block">{subtitle}</p>}
      </div>

      <div className="hidden w-64 shrink-0 lg:block">
        <Input
          prefix={<SearchOutlined className="text-mist-600" />}
          placeholder="Search anything…"
          className="bg-navy-800/70!"
        />
      </div>

      <Dropdown menu={{ items: notifItems }} trigger={["click"]} placement="bottomRight">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full text-mist-400 hover:bg-white/5 hover:text-cloud-100"
          aria-label="Notifications"
        >
          <Badge count={alertCount} size="small" offset={[-2, 2]}>
            <BellOutlined className="text-[16px]" />
          </Badge>
        </button>
      </Dropdown>

      <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
        <button type="button" className="flex items-center gap-2 rounded-full pl-1 pr-2 hover:bg-white/5">
          <Avatar src={getImageUrl(user?.image)} icon={<UserOutlined />} size={32} />
          <span className="hidden text-sm font-medium text-cloud-100 sm:inline">{user?.name}</span>
        </button>
      </Dropdown>
    </div>
  );
}
