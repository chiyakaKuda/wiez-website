export default function CTAPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]"
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#0F172A 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 1200 500"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M0 60H260V300H560" stroke="#0F172A" strokeWidth="1.5" />
        <path d="M1200 100H940V380H660" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx="260" cy="300" r="5" fill="#0F172A" />
        <circle cx="940" cy="380" r="5" fill="#0F172A" />
      </svg>

      <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full bg-lime/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-navy/5 blur-3xl" />
    </div>
  );
}
