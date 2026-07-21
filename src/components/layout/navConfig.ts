import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
  CrownOutlined,
  MessageOutlined,
  FileSearchOutlined,
  SolutionOutlined,
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
