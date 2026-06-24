import { Quote } from "lucide-react";

export default function WelcomePattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        className="absolute left-6 top-10 h-14 w-14 opacity-[0.14] lg:left-10 lg:top-14 lg:h-20 lg:w-20"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path d="M2 22V2H22" stroke="#0F172A" strokeWidth="1.5" />
      </svg>
      <svg
        className="absolute bottom-10 right-6 h-14 w-14 opacity-[0.14] lg:bottom-14 lg:right-10 lg:h-20 lg:w-20"
        viewBox="0 0 64 64"
        fill="none"
      >
        <path d="M62 42V62H42" stroke="#0F172A" strokeWidth="1.5" />
      </svg>

      <svg
        className="absolute inset-x-0 top-1/2 h-px w-full opacity-[0.08]"
        preserveAspectRatio="none"
        viewBox="0 0 100 1"
      >
        <line
          x1="0"
          y1="0.5"
          x2="100"
          y2="0.5"
          stroke="#0F172A"
          strokeWidth="0.5"
          strokeDasharray="1.5 2"
        />
      </svg>

      <Quote
        className="absolute -right-8 top-6 h-44 w-44 text-navy/[0.05] lg:h-64 lg:w-64"
        strokeWidth={1}
      />
    </div>
  );
}
