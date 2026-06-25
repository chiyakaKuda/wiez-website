"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { forgotPasswordAction } from "@/actions/auth";

const EASE = [0.22, 1, 0.36, 1] as const;

const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address."),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordValues) {
    const result = await forgotPasswordAction(values.email);
    if (!result.success) {
      toast.error(result.error || "Something went wrong. Please try again.");
      return;
    }
    toast.success("Reset link sent.");
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="w-full max-w-sm"
      >
        <Link href="/" className="mb-8 flex justify-center">
          <Logo />
        </Link>

        <div className="rounded-[16px] border border-navy/5 bg-white p-8 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.2)]">
          {submitted ? (
            <div className="flex flex-col items-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime">
                <MailCheck className="h-7 w-7 text-navy" />
              </div>
              <h1 className="mt-5 font-heading text-xl font-extrabold text-navy">
                Check your email
              </h1>
              <p className="mt-2 font-sans text-sm text-slate-custom">
                If an account exists for that email, we&apos;ve sent a link
                to reset your password.
              </p>
              <Link
                href="/sign-in"
                className="mt-7 inline-flex items-center gap-1.5 font-nav text-sm font-semibold text-navy hover:text-lime"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-xl font-extrabold text-navy">
                Forgot your password?
              </h1>
              <p className="mt-2 font-sans text-sm text-slate-custom">
                Enter your email and we&apos;ll send you a link to reset it.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
                noValidate
              >
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="h-11 rounded-[8px]"
                    aria-invalid={Boolean(errors.email)}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full rounded-[6px] bg-[#0F172A] text-white hover:bg-[#1E293B]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Link
                  href="/sign-in"
                  className="flex items-center justify-center gap-1.5 font-nav text-sm font-semibold text-navy hover:text-lime"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to sign in
                </Link>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
