import {
  Award,
  BadgeCheck,
  Lightbulb,
  Sparkles,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

const BADGE_ICONS: Record<string, LucideIcon> = {
  Mentor: Users,
  "Industry Leader": Award,
  Researcher: Lightbulb,
  "STEM Advocate": Sparkles,
  "Innovation Award": Trophy,
  "Professional Engineer": BadgeCheck,
};

export default function EngineerBadge({ label }: { label: string }) {
  const Icon = BADGE_ICONS[label] ?? BadgeCheck;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-navy/10 bg-navy/[0.04] px-3 py-1 font-nav text-[11px] font-semibold text-navy">
      <Icon className="h-3.5 w-3.5 text-lime" strokeWidth={2} />
      {label}
    </span>
  );
}
