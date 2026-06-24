"use client";

import { motion } from "framer-motion";
import { Building2, GraduationCap, Landmark, Network } from "lucide-react";

export default function PartnershipNetworkGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute -right-6 -top-10 h-56 w-56 rounded-full bg-lime/15 blur-3xl" />
      <div className="absolute -bottom-10 -left-6 h-56 w-56 rounded-full bg-navy/10 blur-3xl" />

      <svg
        className="absolute inset-0 h-full w-full text-navy/15"
        viewBox="0 0 400 400"
        fill="none"
      >
        <line x1="200" y1="200" x2="80" y2="100" stroke="currentColor" strokeWidth="1.5" />
        <line x1="200" y1="200" x2="320" y2="100" stroke="currentColor" strokeWidth="1.5" />
        <line x1="200" y1="200" x2="80" y2="300" stroke="currentColor" strokeWidth="1.5" />
        <line x1="200" y1="200" x2="320" y2="300" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 z-10 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy shadow-xl"
      >
        <span className="font-heading text-sm font-extrabold text-lime">
          WiEZ
        </span>
      </motion.div>

      {[
        { Icon: GraduationCap, position: "left-[12%] top-[18%]", delay: 0 },
        { Icon: Building2, position: "right-[12%] top-[18%]", delay: 0.4 },
        { Icon: Landmark, position: "left-[12%] bottom-[18%]", delay: 0.8 },
        { Icon: Network, position: "right-[12%] bottom-[18%]", delay: 1.2 },
      ].map(({ Icon, position, delay }, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
          className={`absolute z-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-navy/5 bg-white shadow-lg shadow-navy/10 ${position}`}
        >
          <Icon className="h-6 w-6 text-navy" strokeWidth={1.75} />
        </motion.div>
      ))}
    </div>
  );
}
