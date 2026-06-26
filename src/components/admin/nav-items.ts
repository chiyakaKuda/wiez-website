import {
  LayoutDashboard,
  Users,
  IdCard,
  Calendar,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  ShieldCheck,
  Award,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types/auth";

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  roles: UserRole[] | "all";
  links: NavLink[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "OVERVIEW",
    roles: "all",
    links: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "MY MEMBERSHIP",
    roles: ["member"],
    links: [{ label: "My Membership", href: "/dashboard/membership", icon: Award }],
  },
  {
    label: "MEMBERSHIP",
    roles: ["super_admin", "org_admin", "membership_officer"],
    links: [
      { label: "Members", href: "/admin/members", icon: Users },
      { label: "Memberships", href: "/admin/memberships", icon: IdCard },
    ],
  },
  {
    label: "EVENTS",
    roles: ["super_admin", "org_admin", "events_manager"],
    links: [{ label: "Events", href: "/admin/events", icon: Calendar }],
  },
  {
    label: "FINANCE",
    roles: ["super_admin", "org_admin", "membership_officer"],
    links: [{ label: "Payments", href: "/admin/payments", icon: DollarSign }],
  },
  {
    label: "CONTENT",
    roles: ["super_admin", "org_admin", "content_editor"],
    links: [{ label: "Content", href: "/admin/content", icon: FileText }],
  },
  {
    label: "ADMINISTRATION",
    roles: ["super_admin", "org_admin"],
    links: [
      { label: "WhatsApp", href: "/admin/whatsapp", icon: MessageCircle },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
  {
    label: "USERS",
    roles: ["super_admin"],
    links: [{ label: "Users", href: "/admin/users", icon: ShieldCheck }],
  },
];

export function getVisibleSections(
  userRoles: UserRole[],
  dashboardHref: string
): NavSection[] {
  return NAV_SECTIONS.map((section) => {
    const visible =
      section.roles === "all" || section.roles.some((role) => userRoles.includes(role));
    if (!visible) return { ...section, links: [] };
    if (section.label !== "OVERVIEW") return section;
    return {
      ...section,
      links: section.links.map((link) => ({ ...link, href: dashboardHref })),
    };
  }).filter((section) => section.links.length > 0);
}

export function isNavLinkActive(pathname: string, href: string): boolean {
  if (href === "/admin" || href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const ROUTE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/dashboard": "Dashboard",
  "/dashboard/membership": "My Membership",
  "/admin/members": "Members",
  "/admin/memberships": "Memberships",
  "/admin/events": "Events",
  "/admin/whatsapp": "WhatsApp",
  "/admin/payments": "Payments",
  "/admin/reports": "Reports",
  "/admin/users": "System Users",
  "/admin/settings": "Settings",
  "/admin/content": "Content",
};

export function getPageTitle(pathname: string): { title: string; breadcrumb: string } {
  if (pathname === "/dashboard") return { title: "Dashboard", breadcrumb: "Dashboard" };
  if (pathname === "/admin") return { title: "Dashboard", breadcrumb: "Admin" };
  if (pathname.startsWith("/dashboard/")) {
    const title = ROUTE_TITLES[pathname] ?? "Dashboard";
    return { title, breadcrumb: `Dashboard / ${title}` };
  }

  const title = ROUTE_TITLES[pathname] ?? "Admin";
  return { title, breadcrumb: `Admin / ${title}` };
}
