import Image from "next/image";
import { cn } from "@/lib/utils";

// The brand mark is a white-background lockup, so on dark surfaces (footer,
// dark hero) we frame it in a white badge; on light surfaces it sits bare and
// blends in. Callers keep passing `light` exactly as before.
export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        light && "rounded-lg bg-white px-2.5 py-1.5 shadow-sm"
      )}
    >
      <Image
        src="/logos/wiez-logo.png"
        alt="WiEZ — Women in Engineering Zimbabwe"
        width={578}
        height={244}
        priority
        className="h-9 w-auto sm:h-10"
      />
    </span>
  );
}
