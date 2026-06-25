"use client";

import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Search, Settings, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MobileSidebar } from "@/components/admin/mobile-sidebar";
import { getPageTitle } from "@/components/admin/nav-items";
import { signOutAction } from "@/actions/auth";
import { isAdminRole } from "@/lib/rbac";
import type { UserRole } from "@/types/auth";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Topbar({
  name,
  email,
  roles,
}: {
  name: string;
  email: string;
  roles: UserRole[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { title, breadcrumb } = getPageTitle(pathname);
  const isAdmin = roles.some((role) => isAdminRole(role));

  async function handleSignOut() {
    await signOutAction();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:px-6">
      <MobileSidebar name={name} email={email} roles={roles} />

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-heading text-base font-semibold text-navy">{title}</h1>
        <p className="hidden truncate font-nav text-xs text-slate-400 sm:block">{breadcrumb}</p>
      </div>

      <div className="hidden md:block">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search..."
            aria-label="Search"
            className="h-9 w-56 rounded-[8px] border border-slate-200 bg-slate-50 pl-9 pr-3 font-sans text-sm text-navy placeholder:text-slate-400 focus:border-lime focus:ring-2 focus:ring-lime/30 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        aria-label="View notifications"
        className="relative flex size-9 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-navy"
      >
        <Bell className="size-[18px]" />
        <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-lime font-nav text-[10px] font-bold text-navy">
          3
        </span>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label="Open account menu"
              className="flex items-center gap-2 rounded-full pr-1 pl-1 hover:bg-slate-100"
            />
          }
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-navy font-nav text-xs font-semibold text-white">
            {initials(name)}
          </span>
          <ChevronDown className="hidden size-3.5 text-slate-400 sm:block" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex flex-col gap-0.5 px-2 py-1.5">
            <span className="font-nav text-sm font-semibold text-navy">{name}</span>
            <span className="font-sans text-xs text-slate-400">{email}</span>
          </div>
          <DropdownMenuSeparator />
          {isAdmin && (
            <>
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                <User className="size-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
            <LogOut className="size-4" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
