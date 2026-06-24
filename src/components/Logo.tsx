import { cn } from "@/lib/utils";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex flex-col leading-none">
      <span
        className={cn(
          "font-heading text-2xl font-extrabold tracking-tight transition-colors duration-300",
          light ? "text-white" : "text-navy"
        )}
      >
        W<span className="text-lime">i</span>EZ
      </span>
      <span
        className={cn(
          "mt-1 font-nav text-[10px] font-medium uppercase tracking-[0.18em] transition-colors duration-300",
          light ? "text-white/70" : "text-slate-custom"
        )}
      >
        Women in Engineering Zimbabwe
      </span>
    </div>
  );
}
