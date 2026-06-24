"use client";

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Check, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const INITIAL_STATE: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.subject.trim()) errors.subject = "Please enter a subject.";
  if (!values.message.trim()) errors.message = "Please enter a message.";
  return errors;
}

function inputClassName(hasError: boolean) {
  return cn(
    "w-full rounded-2xl border bg-white px-4 py-3 font-sans text-sm text-navy outline-none transition-colors duration-200 focus:border-navy",
    hasError ? "border-red-400" : "border-navy/10"
  );
}

function Field({
  label,
  id,
  error,
  optional,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="font-nav text-sm font-semibold text-navy"
      >
        {label}
        {optional && (
          <span className="ml-1 font-sans text-xs font-normal text-slate-custom">
            (optional)
          </span>
        )}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p className="mt-1.5 font-sans text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [values, setValues] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">(
    "idle"
  );

  function handleChange(field: keyof FormState) {
    return (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || status === "loading") return;

    setStatus("loading");
    // Placeholder for a real contact API call.
    setTimeout(() => setStatus("success"), 900);
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="flex flex-col items-center rounded-[28px] border border-navy/5 bg-white px-8 py-12 text-center shadow-[0_20px_50px_-25px_rgba(15,23,42,0.2)]"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-lime"
        >
          <Check className="h-7 w-7 text-navy" strokeWidth={3} />
        </motion.div>
        <h3 className="mt-5 font-heading text-2xl font-extrabold text-navy">
          Message Sent
        </h3>
        <p className="mt-2 max-w-sm font-sans text-sm text-slate-custom">
          Thank you for reaching out. A member of the WiEZ team will get
          back to you shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[28px] border border-navy/5 bg-white p-8 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.2)] lg:p-10"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Name" id="contact-name" error={errors.name}>
          <input
            id="contact-name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange("name")}
            aria-invalid={Boolean(errors.name)}
            className={inputClassName(Boolean(errors.name))}
          />
        </Field>

        <Field label="Email Address" id="contact-email" error={errors.email}>
          <input
            id="contact-email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange("email")}
            aria-invalid={Boolean(errors.email)}
            className={inputClassName(Boolean(errors.email))}
          />
        </Field>

        <Field label="Phone Number" id="contact-phone" optional>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange("phone")}
            className={inputClassName(false)}
          />
        </Field>

        <Field label="Subject" id="contact-subject" error={errors.subject}>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={handleChange("subject")}
            aria-invalid={Boolean(errors.subject)}
            className={inputClassName(Boolean(errors.subject))}
          />
        </Field>
      </div>

      <div className="mt-5">
        <Field label="Message" id="contact-message" error={errors.message}>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            value={values.message}
            onChange={handleChange("message")}
            aria-invalid={Boolean(errors.message)}
            className={cn(
              inputClassName(Boolean(errors.message)),
              "resize-none"
            )}
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-lime px-7 py-4 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-[1.02] disabled:opacity-70 sm:w-auto"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <Send className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
