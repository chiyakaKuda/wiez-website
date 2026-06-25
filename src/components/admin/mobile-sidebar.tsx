"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarNavContent } from "@/components/admin/sidebar";
import type { UserRole } from "@/types/auth";

export function MobileSidebar({
  name,
  email,
  roles,
}: {
  name: string;
  email: string;
  roles: UserRole[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-navy/30 lg:hidden"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-navy"
              >
                <X className="size-4" />
              </button>
              <SidebarNavContent
                name={name}
                email={email}
                roles={roles}
                onNavigate={() => setOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
