"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AuthSplitScreen from "@/components/auth/AuthSplitScreen";
import { signUpAction } from "@/actions/auth";
import { ZIMBABWE_PROVINCES, ENGINEERING_DISCIPLINES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const signUpSchema = z
  .object({
    name: z.string().min(2, "Please enter your full name."),
    email: z.email("Please enter a valid email address."),
    phone: z.string().min(7, "Please enter a valid phone number."),
    province: z.enum(ZIMBABWE_PROVINCES, "Please select your province."),
    engineeringDiscipline: z.enum(
      ENGINEERING_DISCIPLINES,
      "Please select your engineering discipline."
    ),
    password: z
      .string()
      .min(8, "Must be at least 8 characters.")
      .regex(/[A-Z]/, "Must include an uppercase letter.")
      .regex(/[a-z]/, "Must include a lowercase letter.")
      .regex(/[0-9]/, "Must include a number."),
    confirmPassword: z.string(),
    terms: z.boolean().refine((v) => v === true, "You must accept the terms."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpValues = z.infer<typeof signUpSchema>;

const STEP_ONE_FIELDS = [
  "name",
  "email",
  "phone",
  "province",
  "engineeringDiscipline",
] as const;

export default function SignUpPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function handleNext() {
    const valid = await trigger(STEP_ONE_FIELDS);
    if (valid) setStep(2);
  }

  async function onSubmit(values: SignUpValues) {
    const result = await signUpAction({
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      province: values.province,
      engineeringDiscipline: values.engineeringDiscipline,
    });

    if (!result.success) {
      toast.error(result.error || "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <AuthSplitScreen>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="flex flex-col items-center text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-lime">
            <Mail className="h-7 w-7 text-navy" />
          </div>
          <h1 className="mt-5 font-heading text-2xl font-extrabold text-navy">
            Check your email to verify your account
          </h1>
          <p className="mt-2 max-w-sm font-sans text-sm text-slate-custom">
            We&apos;ve sent a verification link to your email address. Click
            it to activate your WiEZ account.
          </p>
          <Link
            href="/sign-in"
            className="mt-8 font-nav text-sm font-semibold text-navy hover:text-lime"
          >
            Return to sign in
          </Link>
        </motion.div>
      </AuthSplitScreen>
    );
  }

  return (
    <AuthSplitScreen>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <h1 className="font-heading text-3xl font-extrabold text-navy">
          Create your account
        </h1>
        <p className="mt-2 font-sans text-sm text-slate-custom">
          Join Zimbabwe&apos;s community of women engineers.
        </p>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                step >= 1 ? "bg-lime" : "bg-slate-custom/30"
              )}
            />
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                step >= 2 ? "bg-lime" : "bg-slate-custom/30"
              )}
            />
          </div>
          <span className="font-nav text-xs font-semibold text-slate-custom">
            Step {step} of 2
          </span>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7"
          noValidate
        >
          <AnimatePresence mode="wait" initial={false}>
            {step === 1 ? (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    className="h-11 rounded-[8px]"
                    aria-invalid={Boolean(errors.name)}
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+263 XX XXX XXXX"
                    className="h-11 rounded-[8px]"
                    aria-invalid={Boolean(errors.phone)}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="province">Province</Label>
                  <Controller
                    control={control}
                    name="province"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="province"
                          className="h-11 w-full rounded-[8px]"
                        >
                          <SelectValue placeholder="Select your province" />
                        </SelectTrigger>
                        <SelectContent>
                          {ZIMBABWE_PROVINCES.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.province && (
                    <p className="text-xs text-red-500">{errors.province.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="engineeringDiscipline">
                    Engineering Discipline
                  </Label>
                  <Controller
                    control={control}
                    name="engineeringDiscipline"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="engineeringDiscipline"
                          className="h-11 w-full rounded-[8px]"
                        >
                          <SelectValue placeholder="Select your discipline" />
                        </SelectTrigger>
                        <SelectContent>
                          {ENGINEERING_DISCIPLINES.map((discipline) => (
                            <SelectItem key={discipline} value={discipline}>
                              {discipline}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.engineeringDiscipline && (
                    <p className="text-xs text-red-500">
                      {errors.engineeringDiscipline.message}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleNext}
                  className="h-11 w-full rounded-[6px] bg-[#0F172A] text-white hover:bg-[#1E293B]"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
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
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
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

                <div className="flex items-start gap-2">
                  <Controller
                    control={control}
                    name="terms"
                    render={({ field }) => (
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="mt-0.5"
                      />
                    )}
                  />
                  <Label htmlFor="terms" className="font-normal text-slate-custom">
                    I agree to the{" "}
                    <Link href="/terms" className="font-semibold text-navy hover:text-lime">
                      Terms and Conditions
                    </Link>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-xs text-red-500">{errors.terms.message}</p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="h-11 rounded-[6px]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 flex-1 rounded-[6px] bg-[#0F172A] text-white hover:bg-[#1E293B]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <p className="mt-8 text-center font-sans text-sm text-slate-custom">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-navy hover:text-lime">
            Sign in
          </Link>
        </p>
      </motion.div>
    </AuthSplitScreen>
  );
}
