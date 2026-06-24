"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
};

export default function AnimatedCounter({
  value,
  suffix = "",
  label,
  delay = 0,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setCount(Math.round(latest)),
    });
    return () => controls.stop();
  }, [isInView, value, delay]);

  return (
    <div ref={ref}>
      <div className="font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
        {count}
        {suffix}
      </div>
      <div className="mt-1 font-sans text-sm text-slate-custom">{label}</div>
    </div>
  );
}
