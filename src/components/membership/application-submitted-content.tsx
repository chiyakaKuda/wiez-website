"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileSearch, Mail, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const NEXT_STEPS = [
  { icon: FileSearch, title: "Application Review", description: "5–7 business days" },
  {
    icon: Mail,
    title: "Email Notification",
    description: "Approval or request for more information",
  },
  { icon: CreditCard, title: "Payment & Activation", description: "If your application is approved" },
];

export function ApplicationSubmittedContent({ reference }: { reference: string | null }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <motion.svg
        width="88"
        height="88"
        viewBox="0 0 88 88"
        fill="none"
        initial="hidden"
        animate="visible"
      >
        <motion.circle
          cx="44"
          cy="44"
          r="40"
          stroke="#A3E635"
          strokeWidth="4"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
        <motion.path
          d="M27 45L39 57L61 33"
          stroke="#0F172A"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
        />
      </motion.svg>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="mt-6 font-heading text-3xl font-extrabold text-navy"
      >
        Application Submitted!
      </motion.h1>

      {reference && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.4 }}
          className="mt-5 rounded-xl border border-lime/40 bg-lime/10 px-6 py-3"
        >
          <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-custom">
            Reference
          </p>
          <p className="mt-1 font-heading text-xl font-bold tracking-wide text-navy">
            {reference}
          </p>
        </motion.div>
      )}

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.4 }}
        className="mt-5 font-sans text-sm leading-relaxed text-slate-custom"
      >
        Thank you for applying to WiEZ. Our membership team will review your application
        within 5–7 business days.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        className="mt-8 w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm"
      >
        <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-400">
          What happens next
        </p>
        <ol className="mt-3 space-y-4">
          {NEXT_STEPS.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.title} className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy font-nav text-xs font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="flex items-center gap-1.5 font-nav text-sm font-semibold text-navy">
                    <Icon className="size-3.5 text-slate-400" />
                    {item.title}
                  </p>
                  <p className="font-sans text-xs text-slate-500">{item.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.4 }}
        className="mt-5 font-sans text-xs text-slate-400"
      >
        Save your reference number for future correspondence.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.4 }}
        className="mt-7 flex w-full flex-col gap-3 sm:flex-row"
      >
        <Button
          render={<Link href="/dashboard/membership" />}
          className="h-11 flex-1 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
        >
          Track My Application
        </Button>
        <Button render={<Link href="/" />} variant="outline" className="h-11 flex-1 rounded-[6px]">
          Return to Home
        </Button>
      </motion.div>
    </div>
  );
}
