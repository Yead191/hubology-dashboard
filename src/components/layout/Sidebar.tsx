import { Badge } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_ITEMS } from "./navConfig";
import { cn } from "@/lib/utils";
import { useVendors } from "@/features/vendors/VendorsContext";
import { useForum } from "@/features/forum/ForumContext";

export function Sidebar({ mobile, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { vendors } = useVendors();
  const { posts } = useForum();

  const pendingVendors = vendors.filter((v) => v.status === "pending").length;
  const reportedPosts = posts.filter((p) => p.status === "reported").length;

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
      <div className="flex items-center gap-2.5 px-5 pb-2 pt-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#8131F0] to-[#4A1C8A] shadow-[0_6px_18px_-6px_rgba(129,49,240,0.75)]">
          <span className="font-display text-sm font-bold text-white">H</span>
        </div>
        <div className="leading-tight">
          <div className="font-display text-[15px] font-semibold text-cloud-100">Hubology</div>
          <div className="text-[11px] text-mist-600">Admin workspace</div>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
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
                  {item.children.map((child) => (
                    <NavLink
                      key={child.key}
                      active={location.pathname === child.path}
                      icon={child.icon}
                      label={child.label}
                      badge={badgeCount(child.badgeKey)}
                      compact
                      onClick={() => {
                        navigate(child.path);
                        onNavigate?.();
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </NavGroup>
      </nav>

      <div className="mx-3 mb-4 rounded-2xl border border-navy-600/50 bg-navy-800/60 p-3.5">
        <div className="text-[11px] font-medium uppercase tracking-wide text-mist-600">Workspace status</div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-mist-400">Pending applications</span>
          <span className="font-semibold text-cloud-100">{pendingVendors}</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className="text-mist-400">Reported posts</span>
          <span className="font-semibold text-cloud-100">{reportedPosts}</span>
        </div>
      </div>
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
          ? "bg-gradient-to-r from-[#8131F0]/25 to-[#4A1C8A]/20 text-cloud-100 gradient-ring"
          : "text-mist-400 hover:bg-white/[0.04] hover:text-cloud-100"
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
