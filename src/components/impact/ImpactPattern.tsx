export default function ImpactPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(#0F172A 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.05]"
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <line x1="0" y1="70" x2="1200" y2="70" stroke="#0F172A" strokeWidth="1" />
        <line x1="0" y1="530" x2="1200" y2="530" stroke="#0F172A" strokeWidth="1" />
        <line x1="150" y1="0" x2="150" y2="600" stroke="#0F172A" strokeWidth="1" />
        <line x1="1050" y1="0" x2="1050" y2="600" stroke="#0F172A" strokeWidth="1" />
      </svg>
    </div>
  );
}
