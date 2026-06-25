"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AuthSplitScreen({
  children,
  quote = "Engineering Zimbabwe's future, together.",
}: {
  children: ReactNode;
  quote?: string;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-navy p-12 lg:flex">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(#FFFFFF 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          <motion.div
            animate={{ y: [0, -16, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[10%] top-[20%] h-20 w-20 rounded-2xl border border-white/10"
          />
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute right-[14%] top-[55%] h-14 w-14 rounded-full border border-lime/30"
          />
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />
        </div>

        <Link href="/" className="relative z-10 w-fit">
          <Logo light />
        </Link>

        <motion.blockquote
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative z-10 max-w-md"
        >
          <p className="font-heading text-3xl font-extrabold leading-tight text-white">
            &ldquo;{quote}&rdquo;
          </p>
          <footer className="mt-4 font-nav text-sm font-semibold text-white/60">
            Women in Engineering Zimbabwe
          </footer>
        </motion.blockquote>
      </div>

      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-block lg:hidden">
            <Logo />
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
