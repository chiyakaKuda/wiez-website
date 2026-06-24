"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const SESSIONS = [
  { time: "09:00", title: "Opening Remarks" },
  { time: "09:30", title: "Eng. Beverly Nyakutsikwa" },
  { time: "10:15", title: "Joy Makumbe" },
  { time: "11:00", title: "Dr. Loice Gudukeya" },
  { time: "12:00", title: "Panel Discussion" },
] as const;

type Status = "completed" | "current" | "upcoming";

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function getStatuses(now: Date | null): Status[] {
  if (!now) return SESSIONS.map(() => "upcoming");
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  let currentIndex = -1;
  SESSIONS.forEach((session, i) => {
    if (toMinutes(session.time) <= nowMinutes) currentIndex = i;
  });
  return SESSIONS.map((_, i) => {
    if (currentIndex === -1) return "upcoming";
    if (i < currentIndex) return "completed";
    if (i === currentIndex) return "current";
    return "upcoming";
  });
}

export default function SpeakerTimeline() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const statuses = getStatuses(now);

  return (
    <div>
      <p className="font-nav text-xs font-semibold uppercase tracking-[0.16em] text-slate-custom">
        Today&apos;s Speakers
      </p>

      <ol className="mt-4">
        {SESSIONS.map((session, i) => {
          const status = statuses[i];
          const isLast = i === SESSIONS.length - 1;

          return (
            <li key={session.time} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center">
                <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
                  {status === "completed" && (
                    <CircleCheck className="h-4 w-4 text-slate-custom" />
                  )}
                  {status === "current" && (
                    <>
                      <motion.span
                        className="absolute h-4 w-4 rounded-full bg-lime/40"
                        animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <span className="relative h-2 w-2 rounded-full bg-lime" />
                    </>
                  )}
                  {status === "upcoming" && (
                    <span className="h-2 w-2 rounded-full border border-slate-custom/40" />
                  )}
                </span>
                {!isLast && (
                  <span
                    className={cn(
                      "mt-1 w-px flex-1",
                      status === "completed"
                        ? "bg-slate-custom/30"
                        : "bg-slate-custom/15"
                    )}
                  />
                )}
              </div>

              <motion.div
                layout
                className={cn(
                  "mb-4 flex-1 rounded-xl px-3 py-2 transition-colors duration-300",
                  status === "current" && "bg-lime/10"
                )}
              >
                <p
                  className={cn(
                    "font-nav text-xs font-semibold tabular-nums",
                    status === "current" ? "text-navy" : "text-slate-custom"
                  )}
                >
                  {session.time}
                </p>
                <p
                  className={cn(
                    "font-sans text-sm",
                    status === "completed" &&
                      "text-slate-custom/70 line-through",
                    status === "current" && "font-semibold text-navy",
                    status === "upcoming" && "text-slate-custom"
                  )}
                >
                  {session.title}
                </p>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
