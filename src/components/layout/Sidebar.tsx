import { Badge } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "./navConfig";
import { cn } from "@/lib/utils";
import { useGetDashboardOverviewQuery } from "@/redux/features/dashboard/dashboardApi";
import { useGetPostsQuery } from "@/redux/features/forum/forumApi";

export function Sidebar({ mobile, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: dashboardRes } = useGetDashboardOverviewQuery();
  const { data: reportedRes } = useGetPostsQuery({ status: "reported", page: 1, limit: 1 });

  const pendingVendors = dashboardRes?.data?.pendingVendors ?? 0;
  const reportedPosts = reportedRes?.pagination?.total ?? 0;

  const badgeCount = (key?: "pendingVendors" | "reportedPosts") => {
    if (key === "pendingVendors") return pendingVendors;
    if (key === "reportedPosts") return reportedPosts;
    return 0;
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={cn("flex h-full w-full flex-col bg-navy-850 border-r border-navy-700/60", mobile ? "" : "")}>
      <div className="flex flex-col items-center gap-2.5 px-5 pb-2 pt-6">
        <img
          src="/logo-hubology.svg"
          alt="Hubology"
          className="h-8 w-auto shrink-0"
        />
        
      </div>

      <nav className="mt-4 flex-1 space-y-5 overflow-y-auto px-3 pb-4 pt-2">
        <NavGroup>
          {NAV_ITEMS.map((item) => (
            <div key={item.key}>
              <NavLink
                active={isActive(item.path)}
                icon={item.icon}
                label={item.label}
                badge={badgeCount(item.badgeKey)}
                onClick={() => {
                  navigate(item.path);
                  onNavigate?.();
                }}
              />
              {item.children && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-navy-600/60 pl-3">
                  {item.children.map((child) => {
                    // Prefer exact match so sibling routes like /services and
                    // /services/bookings don't both light up as active.
                    const childActive =
                      location.pathname === child.path ||
                      (child.path !== item.path && location.pathname.startsWith(`${child.path}/`));
                    return (
                      <NavLink
                        key={child.key}
                        active={childActive}
                        icon={child.icon}
                        label={child.label}
                        badge={badgeCount(child.badgeKey)}
                        compact
                        onClick={() => {
                          navigate(child.path);
                          onNavigate?.();
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </NavGroup>
      </nav>

    </div>
  );
}

function NavGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

function NavLink({
  active,
  icon: Icon,
  label,
  badge,
  compact,
  onClick,
}: {
  active: boolean;
  icon: React.ComponentType;
  label: string;
  badge?: number;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "surface-hover flex w-full items-center gap-2.5 rounded-xl px-3 text-left text-[13.5px] font-medium",
        compact ? "py-1.5" : "py-2.5",
        active
          ? "bg-linear-to-r from-[#8131F0]/25 to-[#4A1C8A]/20 text-cloud-100 gradient-ring"
          : "text-mist-400 hover:bg-white/4 hover:text-cloud-100"
      )}
    >
      <Icon />
      <span className="flex-1 truncate">{label}</span>
      {!!badge && (
        <Badge
          count={badge}
          size="small"
          style={{ backgroundColor: active ? "#8131F0" : "#23274f", color: active ? "#fff" : "#c9cee8" }}
        />
      )}
    </button>
  );
}
