"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, Pin, PinOff, UserPlus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

const EASE = [0.22, 1, 0.36, 1] as const;
const SCROLL_THRESHOLD = 300;
const PIN_STORAGE_KEY = "wiez-fab-pinned";

const GLASS =
  "border border-white/60 bg-white/85 shadow-[0_10px_40px_rgba(15,23,42,0.12)] backdrop-blur-[20px]";

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

function CommunityStatusPill() {
  return (
    <div className={cn("flex items-center gap-2 rounded-full px-3.5 py-1.5", GLASS)}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
      </span>
      <span className="font-nav text-[11px] font-semibold text-navy">
        Community Open
      </span>
    </div>
  );
}

function SocialProofBadge() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex items-center gap-1.5 font-nav text-[11px] font-medium text-navy/60"
    >
      <AnimatedNumber
        value={500}
        suffix="+"
        duration={1.8}
        className="font-heading text-xs font-bold text-navy"
      />
      <span>Members</span>
    </motion.div>
  );
}

function ActionButton({
  action,
  isExpanded,
}: {
  action: Action;
  isExpanded: boolean;
}) {
  const Icon = action.icon;
  return (
    <Link
      href={action.href}
      aria-label={action.label}
      className="block rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2"
    >
      <motion.div
        animate={{ width: isExpanded ? 216 : 56 }}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={{
          width: { duration: 0.35, ease: EASE },
          scale: { duration: 0.2, ease: EASE },
          y: { duration: 0.2, ease: EASE },
        }}
        className={cn(
          "flex h-14 items-center justify-center gap-2.5 overflow-hidden whitespace-nowrap rounded-[20px]",
          isExpanded && "justify-start px-4",
          action.className
        )}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <AnimatePresence>
          {isExpanded && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="overflow-hidden text-sm font-semibold"
            >
              {action.label}
            </motion.span>
          )}
        </AnimatePresence>
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
      className="flex-1 rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2"
    >
      <motion.div
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2, ease: EASE }}
        className={cn(
          "flex h-14 items-center justify-center gap-2 rounded-[20px] px-4 text-sm font-semibold",
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
  const [isHovering, setIsHovering] = useState(false);
  const [isFocusWithin, setIsFocusWithin] = useState(false);
  const [pinned, setPinned] = useState<boolean | null>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(PIN_STORAGE_KEY);
    if (stored === "true" || stored === "false") setPinned(stored === "true");
  }, []);

  function togglePinned() {
    const next = !(pinned ?? false);
    setPinned(next);
    window.localStorage.setItem(PIN_STORAGE_KEY, String(next));
  }

  const isExpanded = pinned === true || isHovering || isFocusWithin;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div
            key="floating-actions-desktop"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
            exit={{ opacity: 0, x: 60 }}
            transition={{
              opacity: { duration: 0.45, ease: EASE },
              x: { duration: 0.45, ease: EASE },
              y: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.45,
              },
            }}
            className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
          >
            <CommunityStatusPill />

            <div
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onFocus={() => setIsFocusWithin(true)}
              onBlur={(e) => {
                if (
                  !(e.relatedTarget instanceof Node) ||
                  !e.currentTarget.contains(e.relatedTarget)
                ) {
                  setIsFocusWithin(false);
                }
              }}
              className={cn(
                "relative flex flex-col items-center gap-2 rounded-[32px] p-3",
                GLASS
              )}
            >
              <button
                type="button"
                onClick={togglePinned}
                aria-label={pinned ? "Unpin dock" : "Pin dock open"}
                aria-pressed={pinned === true}
                className="flex h-6 w-6 items-center justify-center rounded-full text-navy/40 transition-colors duration-200 hover:bg-navy/5 hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
              >
                {pinned ? (
                  <PinOff className="h-3 w-3" />
                ) : (
                  <Pin className="h-3 w-3" />
                )}
              </button>

              {ACTIONS.map((action) => (
                <ActionButton
                  key={action.href}
                  action={action}
                  isExpanded={isExpanded}
                />
              ))}
            </div>

            <SocialProofBadge />
          </motion.div>

          <motion.div
            key="floating-actions-mobile"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ duration: 0.45, ease: EASE }}
            className={cn(
              "fixed inset-x-4 bottom-4 z-30 flex gap-2.5 rounded-[28px] p-3 lg:hidden",
              GLASS
            )}
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
