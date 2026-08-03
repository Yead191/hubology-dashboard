import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Drawer } from "antd";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const PAGE_META: { match: (path: string) => boolean; title: string; subtitle?: string }[] = [
  { match: (p) => p === "/", title: "Overview", subtitle: "Everything happening across Hubology, at a glance" },
  { match: (p) => p === "/services", title: "Manage services", subtitle: "Create and update consulting packages shown on the site" },
  { match: (p) => p === "/services/bookings", title: "Service bookings", subtitle: "Track and manage user bookings across all services" },
  { match: (p) => p === "/vendors", title: "Vendors", subtitle: "Review applications and manage vendor accounts" },
  { match: (p) => p === "/users", title: "Users", subtitle: "View member accounts and manage access status" },
  { match: (p) => p === "/store/orders", title: "Manage orders", subtitle: "Track purchases and update fulfillment status" },
  { match: (p) => p === "/store", title: "Store catalog", subtitle: "Curate digital downloads and office essentials" },
  { match: (p) => p.startsWith("/membership/") && p.endsWith("/subscribers"), title: "Plan subscribers", subtitle: "Members subscribed to this membership plan" },
  { match: (p) => p === "/membership", title: "Membership plans", subtitle: "Premium tiers for users and vendors" },
  { match: (p) => p === "/transactions", title: "Transaction history", subtitle: "Payments across membership, shop, and services" },
  { match: (p) => p.startsWith("/forum/"), title: "Post review", subtitle: "Inspect reports and take moderation action" },
  { match: (p) => p === "/forum", title: "Forum moderation", subtitle: "Monitor community posts and reported content" },
  { match: (p) => p === "/testimonials", title: "Testimonials", subtitle: "Manage client quotes shown on the marketing site" },
  { match: (p) => p === "/inquiries", title: "Website inquiries", subtitle: "Track and manage project leads from the Hubology site" },
  { match: (p) => p === "/ifundayiti", title: "IFundAyiti", subtitle: "Micro grant program overview and analytics" },
  { match: (p) => p === "/ifundayiti/applications", title: "Applications", subtitle: "Manage every application through its full lifecycle" },
  { match: (p) => p === "/ifundayiti/periods", title: "Application periods", subtitle: "Create and manage grant cycles" },
  { match: (p) => p === "/ifundayiti/donations", title: "Donations", subtitle: "Monitor donations to the IFundAyiti Program Fund" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const meta = useMemo(() => {
    return (
      PAGE_META.find((m) => m.match(location.pathname)) ?? {
        match: () => false,
        title: "Hubology Admin",
        subtitle: undefined,
      }
    );
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-navy-900">
      <aside className="hidden w-63 shrink-0 md:block">
        <Sidebar />
      </aside>

      <Drawer
        placement="left"
        open={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        closable={false}
        size={252}
        styles={{ body: { padding: 0 }, content: { background: "transparent" } }}
      >
        <Sidebar mobile onNavigate={() => setMobileNavOpen(false)} />
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={meta.title} subtitle={meta.subtitle} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-7 md:py-7">
          <div className="mx-auto w-full max-w-350">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
