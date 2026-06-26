import Link from "next/link";
import { Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MembershipType } from "@/types/memberships";

const BEST_FOR: Record<string, string> = {
  Student: "Best for engineering students building their foundation.",
  Graduate: "Best for early-career engineers establishing themselves.",
  Professional: "Best for experienced engineers ready to lead.",
  Corporate: "Best for organizations championing women in engineering.",
};

export function Pricing({ membershipTypes }: { membershipTypes: MembershipType[] }) {
  return (
    <section className="bg-slate-50 py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-slate-custom">
            Membership Types & Pricing
          </p>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Choose the membership that fits you
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-4 lg:items-start">
          {membershipTypes.map((type) => {
            const isPopular = type.name === "Professional";
            return (
              <div
                key={type.id}
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border bg-white p-7 shadow-sm",
                  isPopular ? "border-lime ring-2 ring-lime/40" : "border-slate-200"
                )}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-7 rounded-full bg-lime px-3 py-1 font-nav text-[11px] font-semibold text-navy">
                    Most Popular
                  </span>
                )}

                <h3 className="font-heading text-xl font-bold text-navy">{type.name}</h3>
                <p className="mt-1.5 font-sans text-sm text-slate-custom">
                  {BEST_FOR[type.name] ?? type.description}
                </p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-heading text-4xl font-extrabold text-navy">
                    ${type.fee}
                  </span>
                  <span className="font-sans text-sm text-slate-custom">/ year USD</span>
                </div>

                <Link
                  href={`/membership/apply?type=${encodeURIComponent(type.name)}`}
                  className={cn(
                    "mt-6 inline-flex h-11 w-full items-center justify-center rounded-[6px] font-nav text-sm font-semibold transition-colors",
                    isPopular
                      ? "bg-lime text-navy hover:bg-lime/90"
                      : "bg-navy text-white hover:bg-[#1E293B]"
                  )}
                >
                  Apply as {type.name}
                </Link>

                <div className="mt-7 border-t border-slate-100 pt-6">
                  <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Eligibility
                  </p>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-slate-600">
                    {type.eligibilityCriteria}
                  </p>
                </div>

                <div className="mt-6">
                  <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Required Documents
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {type.requiredDocuments.map((doc) => (
                      <li key={doc} className="flex items-start gap-2 font-sans text-sm text-slate-600">
                        <FileText className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Benefits
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 font-sans text-sm text-navy">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-lime" strokeWidth={3} />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
