import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MembershipCta() {
  return (
    <section className="relative isolate overflow-hidden bg-navy py-24 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#FFFFFF 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-8">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Ready to Join Zimbabwe&apos;s Engineering Community?
        </h2>
        <p className="mx-auto mt-5 max-w-xl font-sans text-lg leading-relaxed text-white/70">
          Applications are reviewed on a rolling basis. Apply today.
        </p>
        <div className="mt-9">
          <Link
            href="/membership/apply"
            className="inline-flex items-center gap-2 rounded-full bg-lime px-8 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
          >
            Apply for Membership
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
