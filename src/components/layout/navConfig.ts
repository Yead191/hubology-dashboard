import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
  CrownOutlined,
  MessageOutlined,
  FileSearchOutlined,
  SolutionOutlined,
  HeartOutlined,
  PieChartOutlined,
  CalendarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { ComponentType } from "react";

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: ComponentType;
  children?: NavItem[];
  badgeKey?: "pendingVendors" | "reportedPosts";
}

export const NAV_ITEMS: NavItem[] = [
  { key: "overview", label: "Overview", path: "/", icon: DashboardOutlined },
  { key: "services", label: "Services", path: "/services", icon: AppstoreOutlined },
  {
    key: "vendors",
    label: "Vendors",
    path: "/vendors",
    icon: TeamOutlined,
    children: [
      { key: "vendors-applications", label: "Applications", path: "/vendors/applications", icon: FileSearchOutlined, badgeKey: "pendingVendors" },
      { key: "vendors-all", label: "All vendors", path: "/vendors", icon: SolutionOutlined },
    ],
  },
  {
    key: "ifundayiti",
    label: "IFundAyiti",
    path: "/ifundayiti",
    icon: HeartOutlined,
    children: [
      { key: "ifundayiti-overview", label: "Overview", path: "/ifundayiti", icon: PieChartOutlined },
      { key: "ifundayiti-applications", label: "Applications", path: "/ifundayiti/applications", icon: FileSearchOutlined },
      { key: "ifundayiti-periods", label: "Application Periods", path: "/ifundayiti/periods", icon: CalendarOutlined },
      { key: "ifundayiti-donations", label: "Donations", path: "/ifundayiti/donations", icon: DollarOutlined },
    ],
  },
  { key: "store", label: "Store", path: "/store", icon: ShopOutlined },
  { key: "membership", label: "Membership", path: "/membership", icon: CrownOutlined },
  {
    key: "forum",
    label: "Forum moderation",
    path: "/forum",
    icon: MessageOutlined,
    badgeKey: "reportedPosts",
  },
];
