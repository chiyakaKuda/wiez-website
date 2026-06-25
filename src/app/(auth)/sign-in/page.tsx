"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AuthSplitScreen from "@/components/auth/AuthSplitScreen";
import { signInAction } from "@/actions/auth";

const EASE = [0.22, 1, 0.36, 1] as const;

const signInSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean(),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  async function onSubmit(values: SignInValues) {
    const result = await signInAction(
      values.email,
      values.password,
      values.rememberMe
    );

    if (!result.success) {
      toast.error(result.error || "Invalid email or password");
      return;
    }

    toast.success(
      result.data?.roleLabel
        ? `Signed in as ${result.data.roleLabel}`
        : "Welcome back!"
    );
    const callbackUrl = searchParams.get("callbackUrl");
    router.push(callbackUrl || result.data?.redirectTo || "/dashboard");
  }

  return (
    <AuthSplitScreen>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <h1 className="font-heading text-3xl font-extrabold text-navy">
          Welcome back
        </h1>
        <p className="mt-2 font-sans text-sm text-slate-custom">
          Sign in to your WiEZ account to continue.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 space-y-5"
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

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="font-nav text-xs font-semibold text-navy hover:text-lime"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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

          <div className="flex items-center gap-2">
            <Checkbox
              id="rememberMe"
              checked={watch("rememberMe")}
              onCheckedChange={(checked) => setValue("rememberMe", checked)}
            />
            <Label htmlFor="rememberMe" className="font-normal text-slate-custom">
              Remember me
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-[6px] bg-[#0F172A] text-white hover:bg-[#1E293B]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <p className="mt-8 text-center font-sans text-sm text-slate-custom">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-navy hover:text-lime">
            Sign up
          </Link>
        </p>
      </motion.div>
    </AuthSplitScreen>
  );
}
