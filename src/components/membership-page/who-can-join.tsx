import { Building2, GraduationCap, Rocket, Crown } from "lucide-react";
import type { MembershipType } from "@/types/memberships";

const TYPE_ICONS = {
  Student: GraduationCap,
  Graduate: Rocket,
  Professional: Crown,
  Corporate: Building2,
} as const;

export function WhoCanJoin({ membershipTypes }: { membershipTypes: MembershipType[] }) {
  return (
    <section id="who-can-join" className="bg-white py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-slate-custom">
            Who Can Join
          </p>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Membership is open — and selective
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-slate-custom">
            We review every application individually. Meeting the minimum requirements
            does not guarantee acceptance.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {membershipTypes.map((type) => {
            const Icon = TYPE_ICONS[type.name];
            return (
              <div
                key={type.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-lime/15">
                  <Icon className="size-5 text-navy" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-navy">{type.name}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-slate-custom">
                  {type.eligibilityCriteria}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
