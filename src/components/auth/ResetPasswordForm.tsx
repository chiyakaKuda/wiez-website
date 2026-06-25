"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import { resetPasswordAction } from "@/actions/auth";

const EASE = [0.22, 1, 0.36, 1] as const;

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Must be at least 8 characters.")
      .regex(/[A-Z]/, "Must include an uppercase letter.")
      .regex(/[a-z]/, "Must include a lowercase letter.")
      .regex(/[0-9]/, "Must include a number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetPasswordValues) {
    if (!token) {
      toast.error("This reset link is missing a token. Please request a new one.");
      return;
    }

    const result = await resetPasswordAction(token, values.password);
    if (!result.success) {
      toast.error(result.error || "This reset link is invalid or has expired.");
      return;
    }

    toast.success("Your password has been reset. Please sign in.");
    router.push("/sign-in");
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
          <h1 className="font-heading text-xl font-extrabold text-navy">
            Reset your password
          </h1>
          <p className="mt-2 font-sans text-sm text-slate-custom">
            Choose a new password for your WiEZ account.
          </p>

          {!token && (
            <p className="mt-4 rounded-[8px] bg-red-50 px-3 py-2 text-xs text-red-600">
              This link is missing a reset token. Please request a new one
              from the{" "}
              <Link href="/forgot-password" className="font-semibold underline">
                forgot password
              </Link>{" "}
              page.
            </p>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-5"
            noValidate
          >
            <div className="space-y-1.5">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="h-11 rounded-[8px] pr-10"
                  aria-invalid={Boolean(errors.password)}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-custom hover:text-navy"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="h-11 rounded-[8px] pr-10"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-custom hover:text-navy"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
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
                  Resetting...
                </>
              ) : (
                "Reset Password"
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
        </div>
      </motion.div>
    </div>
  );
}
