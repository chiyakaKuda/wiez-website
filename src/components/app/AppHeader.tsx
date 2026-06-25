"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth";

export default function AppHeader({
  name,
  roleLabel,
  homeHref,
}: {
  name: string;
  roleLabel: string;
  homeHref: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    await signOutAction();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <header className="border-b border-navy/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href={homeHref}>
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-nav text-sm font-semibold text-navy">{name}</p>
            <p className="font-sans text-xs text-slate-custom">{roleLabel}</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSignOut}
            disabled={loading}
            className="h-9 rounded-[6px]"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
