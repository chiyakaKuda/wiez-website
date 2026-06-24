"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Events", href: "/events" },
  { label: "Membership", href: "/membership" },
  { label: "Contact", href: "/contact" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // The hero behind the navbar is light, so links stay navy-toned at all
  // scroll positions; only the navy fullscreen mobile menu needs light text.
  const onDarkBackdrop = isOpen;

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.92)"
            : "rgba(255, 255, 255, 0)",
          boxShadow: isScrolled
            ? "0 8px 30px rgba(15, 23, 42, 0.08)"
            : "0 8px 30px rgba(15, 23, 42, 0)",
        }}
        transition={{ duration: 0.35, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          isScrolled && !isOpen && "backdrop-blur-md"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" onClick={() => setIsOpen(false)} className="z-50">
            <Logo light={onDarkBackdrop} />
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-nav text-sm font-medium transition-colors duration-300 hover:text-lime",
                  onDarkBackdrop ? "text-white/90" : "text-navy/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex">
            <Link
              href="/membership"
              className="rounded-full bg-lime px-5 py-2.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
            >
              Join Network
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            className="z-50 -mr-2 p-2 lg:hidden"
          >
            {isOpen ? (
              <X className="h-7 w-7 text-white" />
            ) : (
              <Menu
                className={cn(
                  "h-7 w-7 transition-colors duration-300",
                  onDarkBackdrop ? "text-white" : "text-navy"
                )}
              />
            )}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-40 flex flex-col bg-navy lg:hidden"
          >
            <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="font-heading text-3xl font-extrabold text-white transition-colors duration-300 hover:text-lime"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{
                  delay: 0.1 + NAV_LINKS.length * 0.06,
                  duration: 0.4,
                  ease: EASE,
                }}
              >
                <Link
                  href="/membership"
                  onClick={() => setIsOpen(false)}
                  className="mt-4 inline-block rounded-full bg-lime px-8 py-3 font-nav text-base font-semibold text-navy"
                >
                  Join Network
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
