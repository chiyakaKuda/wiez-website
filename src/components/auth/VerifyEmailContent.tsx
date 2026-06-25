"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CircleX, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import { verifyEmailAction } from "@/actions/auth";

const EASE = [0.22, 1, 0.36, 1] as const;

type Status = "verifying" | "success" | "error";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>(
    token ? "verifying" : "error"
  );
  const [error, setError] = useState<string | null>(
    token ? null : "This verification link is missing a token."
  );
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token || hasRun.current) return;
    hasRun.current = true;

    verifyEmailAction(token).then((result) => {
      if (!result.success) {
        setStatus("error");
        setError(result.error || "This verification link is invalid or has expired.");
        return;
      }
      setStatus("success");
      setTimeout(() => router.push("/dashboard"), 1800);
    });
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="w-full max-w-sm text-center"
      >
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>

        <div className="rounded-[16px] border border-navy/5 bg-white p-8 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.2)]">
          {status === "verifying" && (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-navy" />
              <h1 className="mt-5 font-heading text-xl font-extrabold text-navy">
                Verifying your email...
              </h1>
              <p className="mt-2 font-sans text-sm text-slate-custom">
                Please wait a moment.
              </p>
            </div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="flex flex-col items-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-7 w-7 text-navy"
                  aria-hidden
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h1 className="mt-5 font-heading text-xl font-extrabold text-navy">
                Your email has been verified
              </h1>
              <p className="mt-2 font-sans text-sm text-slate-custom">
                Setting up your account...
              </p>
            </motion.div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                <CircleX className="h-7 w-7 text-red-500" />
              </div>
              <h1 className="mt-5 font-heading text-xl font-extrabold text-navy">
                Verification failed
              </h1>
              <p className="mt-2 font-sans text-sm text-slate-custom">{error}</p>
              <Link
                href="/sign-in"
                className="mt-7 font-nav text-sm font-semibold text-navy hover:text-lime"
              >
                Return to sign in
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
