import {
  DashboardOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
  CrownOutlined,
  MessageOutlined,
  FileSearchOutlined,
  HeartOutlined,
  PieChartOutlined,
  CalendarOutlined,
  DollarOutlined,
  SettingOutlined,
  BookOutlined,
  UserOutlined,
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
  {
    key: "services",
    label: "Services",
    path: "/services",
    icon: AppstoreOutlined,
    children: [
      {
        key: "services-manage",
        label: "Manage services",
        path: "/services",
        icon: SettingOutlined,
      },
      {
        key: "services-bookings",
        label: "Service bookings",
        path: "/services/bookings",
        icon: BookOutlined,
      },
    ],
  },
  {
    key: "vendors",
    label: "Vendors",
    path: "/vendors",
    icon: TeamOutlined,
    badgeKey: "pendingVendors",
  },
  {
    key: "users",
    label: "Users",
    path: "/users",
    icon: UserOutlined,
  },
  // {
  //   key: "ifundayiti",
  //   label: "IFundAyiti",
  //   path: "/ifundayiti",
  //   icon: HeartOutlined,
  //   children: [
  //     { key: "ifundayiti-overview", label: "Overview", path: "/ifundayiti", icon: PieChartOutlined },
  //     { key: "ifundayiti-applications", label: "Applications", path: "/ifundayiti/applications", icon: FileSearchOutlined },
  //     { key: "ifundayiti-periods", label: "Application Periods", path: "/ifundayiti/periods", icon: CalendarOutlined },
  //     { key: "ifundayiti-donations", label: "Donations", path: "/ifundayiti/donations", icon: DollarOutlined },
  //   ],
  // },
  { key: "store", label: "Store", path: "/store", icon: ShopOutlined },
  {
    key: "membership",
    label: "Membership",
    path: "/membership",
    icon: CrownOutlined,
  },
  {
    key: "forum",
    label: "Forum moderation",
    path: "/forum",
    icon: MessageOutlined,
    badgeKey: "reportedPosts",
  },
];
