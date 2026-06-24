"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, UserPlus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const SCROLL_THRESHOLD = 300;

type Action = {
  href: string;
  label: string;
  icon: LucideIcon;
  className: string;
};

const ACTIONS: Action[] = [
  {
    href: "/membership",
    label: "Become a Member",
    icon: UserPlus,
    className: "bg-lime text-navy",
  },
  {
    href: "/sign-in",
    label: "Sign In",
    icon: LogIn,
    className: "bg-navy text-white",
  },
];

function ActionButton({ action }: { action: Action }) {
  const Icon = action.icon;
  return (
    <Link
      href={action.href}
      aria-label={action.label}
      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: EASE }}
        className={cn(
          "flex h-12 w-12 items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-2xl px-0 transition-[width,padding] duration-300 ease-out",
          "group-hover:w-[208px] group-hover:justify-start group-hover:px-4",
          "group-focus-within:w-[208px] group-focus-within:justify-start group-focus-within:px-4",
          action.className
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span
          className={cn(
            "max-w-0 overflow-hidden text-sm font-semibold opacity-0 transition-all duration-300",
            "group-hover:max-w-[150px] group-hover:opacity-100",
            "group-focus-within:max-w-[150px] group-focus-within:opacity-100"
          )}
        >
          {action.label}
        </span>
      </motion.div>
    </Link>
  );
}

function MobileActionButton({ action }: { action: Action }) {
  const Icon = action.icon;
  return (
    <Link
      href={action.href}
      aria-label={action.label}
      className="flex-1 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2"
    >
      <motion.div
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: EASE }}
        className={cn(
          "flex h-12 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold",
          action.className
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {action.label}
      </motion.div>
    </Link>
  );
}

export default function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="floating-actions-desktop"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="group fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 gap-2.5 rounded-[20px] border border-white/60 bg-white/90 p-3 shadow-[0_20px_45px_-15px_rgba(15,23,42,0.25)] backdrop-blur-lg lg:flex lg:flex-col"
          >
            {ACTIONS.map((action) => (
              <ActionButton key={action.href} action={action} />
            ))}
          </motion.div>

          <motion.div
            key="floating-actions-mobile"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-x-4 bottom-4 z-30 flex gap-2.5 rounded-[20px] border border-white/60 bg-white/90 p-3 shadow-[0_20px_45px_-15px_rgba(15,23,42,0.25)] backdrop-blur-lg lg:hidden"
          >
            {ACTIONS.map((action) => (
              <MobileActionButton key={action.href} action={action} />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
