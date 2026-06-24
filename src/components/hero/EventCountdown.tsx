"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const UNITS: { key: keyof TimeLeft; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
];

function getTimeLeft(targetDate: Date): TimeLeft {
  const totalSeconds = Math.max(
    0,
    Math.floor((targetDate.getTime() - Date.now()) / 1000)
  );
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export default function EventCountdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const tick = () => {
      if (targetDate.getTime() - Date.now() <= 0) {
        setIsLive(true);
        return;
      }
      setTimeLeft(getTimeLeft(targetDate));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (isLive) {
    return (
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
        </span>
        <span className="font-nav text-sm font-bold uppercase tracking-[0.14em] text-navy">
          Live Now
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {UNITS.map((unit) => (
        <div
          key={unit.key}
          className="flex flex-col items-center rounded-xl bg-navy px-2 py-2.5"
        >
          <div className="relative h-7 w-full overflow-hidden">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={timeLeft ? timeLeft[unit.key] : "-"}
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -16, opacity: 0 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="absolute inset-0 flex items-center justify-center font-heading text-xl font-extrabold text-white tabular-nums"
              >
                {timeLeft ? pad(timeLeft[unit.key]) : "--"}
              </motion.span>
            </AnimatePresence>
          </div>
          <span className="mt-1 font-nav text-[10px] uppercase tracking-wider text-white/60">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
