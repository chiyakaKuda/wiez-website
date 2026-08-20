import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import SectionTeaser from "@/components/home/SectionTeaser";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import EventCountdown from "@/components/ui/EventCountdown";
import { SUMMIT_DATE, SUMMIT_LOCATION } from "@/lib/events";

const ABOUT_STATS = [
  { value: 500, suffix: "+", label: "Members" },
  { value: 100, suffix: "+", label: "Events" },
  { value: 8, suffix: "", label: "Provinces" },
];

export default function Home() {
  return (
    <>
      <Hero />

      <SectionTeaser
        id="about"
        eyebrow="About Us"
        title="Empowering Women Engineers Across Zimbabwe"
        description="From our President's welcome to the impact we've made nationwide — meet the women, the milestones and the mission driving WiEZ forward."
        href="/about"
        ctaLabel="Learn About WiEZ"
      >
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          {ABOUT_STATS.map((stat, i) => (
            <div key={stat.label}>
              <AnimatedNumber
                value={stat.value}
                suffix={stat.suffix}
                delay={i * 0.1}
                className="font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl"
              />
              <div className="mt-1 font-sans text-sm text-slate-custom">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </SectionTeaser>

      <SectionTeaser
        id="programs"
        tone="tint"
        eyebrow="What We Do"
        title="Programs That Create Real Impact"
        description="Mentorship, leadership development, STEM outreach, research and scholarships — explore the initiatives helping women engineers thrive at every career stage."
        href="/programs"
        ctaLabel="Explore Programs"
      />

      <SectionTeaser
        id="events"
        eyebrow="Upcoming Events"
        title="Connect, Learn and Grow"
        description="From the Women in Engineering Summit to mentorship sessions and networking forums — see what's happening across Zimbabwe."
        href="/events"
        ctaLabel="View All Events"
      >
        <div className="max-w-xs rounded-2xl border border-navy/10 bg-white p-5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)]">
          <p className="font-nav text-xs font-bold uppercase tracking-[0.16em] text-lime">
            Next Event
          </p>
          <h3 className="mt-2 font-heading text-lg font-extrabold leading-snug text-navy">
            Women in Engineering Summit 2026
          </h3>
          <p className="mt-1.5 font-sans text-sm text-slate-custom">
            {SUMMIT_LOCATION}
          </p>
          <div className="mt-4">
            <EventCountdown targetDate={SUMMIT_DATE} />
          </div>
        </div>
      </SectionTeaser>

      <SectionTeaser
        id="membership"
        tone="tint"
        eyebrow="Membership"
        title="Join Zimbabwe's Leading Network of Women Engineers"
        description="Unlock mentorship, leadership development, networking and career opportunities across student, graduate, professional and corporate tiers."
        href="/membership"
        ctaLabel="Become a Member"
      />

      <SectionTeaser
        id="contact"
        eyebrow="Get in Touch"
        title="Let's Build the Future Together"
        description="Have a question about membership, partnerships or events? We'd love to hear from you."
        href="/contact"
        ctaLabel="Contact Us"
      />

      <Newsletter />
    </>
  );
}
