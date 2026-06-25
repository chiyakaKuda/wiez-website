"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import { RoleBadge } from "@/components/admin/role-badge";
import { getVisibleSections, isNavLinkActive } from "@/components/admin/nav-items";
import { signOutAction } from "@/actions/auth";
import { isAdminRole } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function SidebarNavContent({
  name,
  email,
  roles,
  onNavigate,
}: {
  name: string;
  email: string;
  roles: UserRole[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const isAdmin = roles.some((role) => isAdminRole(role));
  const dashboardHref = isAdmin ? "/admin" : "/dashboard";
  const sections = getVisibleSections(roles, dashboardHref);
  const primaryRole: UserRole = roles[0] ?? "member";

  async function handleSignOut() {
    setSigningOut(true);
    await signOutAction();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <Link href={dashboardHref} onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="px-3 font-nav text-[11px] font-semibold tracking-wider text-slate-400">
              {section.label}
            </p>
            <div className="mt-2 space-y-0.5">
              {section.links.map((link) => {
                const active = isNavLinkActive(pathname, link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md border-l-[3px] px-3 py-2 font-nav text-sm transition-colors",
                      active
                        ? "border-l-lime bg-[#F0FDF4] font-semibold text-navy"
                        : "border-l-transparent text-slate-500 hover:bg-slate-100"
                    )}
                  >
                    <Icon className="size-4" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-navy font-nav text-xs font-semibold text-white">
            {initials(name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-nav text-sm font-semibold text-navy">{name}</p>
            <p className="truncate font-sans text-xs text-slate-400">{email}</p>
          </div>
        </div>
        <div className="mt-3">
          <RoleBadge role={primaryRole} />
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 font-nav text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy disabled:opacity-50"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function Sidebar({
  name,
  email,
  roles,
}: {
  name: string;
  email: string;
  roles: UserRole[];
}) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 border-r border-slate-200 bg-white lg:flex">
      <SidebarNavContent name={name} email={email} roles={roles} />
    </aside>
  );
}
