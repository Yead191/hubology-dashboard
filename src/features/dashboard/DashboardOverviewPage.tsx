import { useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
  FlagFilled,
  ArrowRightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { StatCard } from "@/components/ui/StatCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusTag } from "@/components/ui/StatusTag";
import { useAuth } from "@/features/auth/AuthContext";
import { useServices } from "@/features/services/ServicesContext";
import { useVendors } from "@/features/vendors/VendorsContext";
import { useStore } from "@/features/store/StoreContext";
import { useMembership } from "@/features/membership/MembershipContext";
import { useForum } from "@/features/forum/ForumContext";
import { formatDate } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { services } = useServices();
  const { vendors } = useVendors();
  const { digitalProducts, officeSupplies } = useStore();
  const { plans } = useMembership();
  const { posts } = useForum();

  const pendingVendors = vendors.filter((v) => v.status === "pending");
  const approvedVendors = vendors.filter((v) => v.status === "approved");
  const reportedPosts = posts.filter((p) => p.status === "reported");
  const totalProducts = digitalProducts.length + officeSupplies.length;

  const firstName = user?.name.split(" ")[0] ?? "there";

  return (
    <div>
      <div className="aurora-field glass-panel mb-6 flex flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-xl font-semibold text-cloud-100">Welcome back, {firstName} 👋</h2>
          <p className="mt-1 text-sm text-mist-400">
            Here's what's happening across Hubology today, {formatDate(new Date())}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="btn-gradient !border-0" onClick={() => navigate("/vendors/applications")}>
            Review applications
          </Button>
          <Button onClick={() => navigate("/forum")}>Moderate forum</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Live services" value={services.length} icon={<AppstoreOutlined />} tone="violet" />
        <StatCard
          label="Approved vendors"
          value={approvedVendors.length}
          icon={<TeamOutlined />}
          tone="success"
          trend={pendingVendors.length ? { direction: "up", label: `${pendingVendors.length} pending` } : undefined}
        />
        <StatCard label="Store products" value={totalProducts} icon={<ShopOutlined />} tone="info" />
        <StatCard
          label="Reported posts"
          value={reportedPosts.length}
          icon={<FlagFilled />}
          tone="warning"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-5">
        <GlassCard flat className="xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-[15px] font-semibold text-cloud-100">Needs your attention</h3>
            <Button type="text" size="small" icon={<ArrowRightOutlined />} iconPosition="end" onClick={() => navigate("/vendors/applications")}>
              View all
            </Button>
          </div>

          {pendingVendors.length === 0 && reportedPosts.length === 0 ? (
            <p className="py-8 text-center text-sm text-mist-600">You're all caught up — nothing pending review.</p>
          ) : (
            <div className="space-y-2.5">
              {pendingVendors.slice(0, 3).map((v) => (
                <button
                  key={v.id}
                  onClick={() => navigate("/vendors/applications")}
                  className="surface-hover flex w-full items-center justify-between gap-3 rounded-xl border border-navy-700/60 bg-navy-800/40 p-3 text-left hover:border-violet-600/40"
                >
                  <div className="flex items-center gap-3">
                    <Avatar src={v.profile} icon={<UserOutlined />} size={36} />
                    <div>
                      <div className="text-sm font-medium text-cloud-100">{v.name}</div>
                      <div className="text-xs text-mist-400">Vendor application · {v.role}</div>
                    </div>
                  </div>
                  <StatusTag tone="warning">Pending</StatusTag>
                </button>
              ))}
              {reportedPosts.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => navigate("/forum")}
                  className="surface-hover flex w-full items-center justify-between gap-3 rounded-xl border border-navy-700/60 bg-navy-800/40 p-3 text-left hover:border-violet-600/40"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-cloud-100">{p.title}</div>
                    <div className="text-xs text-mist-400">
                      Forum post · {p.reports.length} report{p.reports.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <StatusTag tone="danger">Reported</StatusTag>
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard flat className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-[15px] font-semibold text-cloud-100">Membership plans</h3>
            <Button type="text" size="small" icon={<ArrowRightOutlined />} iconPosition="end" onClick={() => navigate("/membership")}>
              Manage
            </Button>
          </div>
          <div className="space-y-2.5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="flex items-center justify-between rounded-xl border border-navy-700/60 bg-navy-800/40 p-3"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-cloud-100">
                    {plan.name}
                    {plan.featured && <StatusTag tone="violet">Featured</StatusTag>}
                  </div>
                  <div className="text-xs text-mist-400">{plan.tagline}</div>
                </div>
                <div className="font-display text-sm font-semibold text-cloud-100">${plan.priceMonthly}/mo</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
