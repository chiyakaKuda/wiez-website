import {
  Award,
  BriefcaseBusiness,
  IdCard,
  Network,
  Sparkles,
  Users,
} from "lucide-react";

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Professional Development Workshops",
    description: "Skills-building sessions led by industry experts across every discipline.",
  },
  {
    icon: Network,
    title: "National Networking Events",
    description: "Connect with peers, mentors and industry leaders across Zimbabwe.",
  },
  {
    icon: Users,
    title: "Mentorship Programme Access",
    description: "Structured mentorship matching for members at every career stage.",
  },
  {
    icon: IdCard,
    title: "Digital Membership Certificate & Card",
    description: "An official, verifiable digital certificate and membership card.",
  },
  {
    icon: Award,
    title: "Recognition in WiEZ Directory",
    description: "Be listed in Zimbabwe's directory of women engineering professionals.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Access to Job Board & Career Resources",
    description: "Exclusive job postings and career development resources for members.",
  },
];

export function Benefits() {
  return (
    <section className="bg-white py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-slate-custom">
            Benefits of Membership
          </p>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Everything your membership unlocks
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-lime/15">
                  <Icon className="size-5 text-navy" />
                </div>
                <h3 className="mt-4 font-heading text-base font-bold text-navy">
                  {benefit.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-slate-custom">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
