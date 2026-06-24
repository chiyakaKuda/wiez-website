"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "idle" | "loading" | "success";

export default function SubscribeForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    // Placeholder for a real subscribe API call.
    setTimeout(() => setStatus("success"), 800);
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center rounded-[28px] border border-white/15 bg-white/10 px-8 py-10 text-center backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-lime"
            >
              <Check className="h-7 w-7 text-navy" strokeWidth={3} />
            </motion.div>
            <h3 className="mt-5 font-heading text-2xl font-extrabold text-white">
              Welcome to the WiEZ Community!
            </h3>
            <p className="mt-2 font-sans text-sm text-white/70">
              Check your inbox for updates and opportunities.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 rounded-full border border-white/15 bg-white/10 p-2 backdrop-blur-xl sm:flex-row sm:items-center"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email Address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full flex-1 rounded-full bg-transparent px-6 py-4 font-sans text-base text-white outline-none placeholder:text-white/50 sm:py-3"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex shrink-0 items-center justify-center rounded-full bg-lime px-7 py-4 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105 disabled:opacity-70 sm:py-3"
              >
                {status === "loading" ? "Joining..." : "Join Community"}
              </button>
            </form>

            <div className="mt-5 flex items-center justify-center gap-3 text-center">
              <span className="h-px w-10 bg-white/15" />
              <span className="font-nav text-xs font-semibold uppercase tracking-widest text-white/50">
                or
              </span>
              <span className="h-px w-10 bg-white/15" />
            </div>

            <div className="mt-5 flex justify-center">
              <Link
                href="/membership"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-nav text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
              >
                Become a Member
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
