"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
} from "framer-motion";

const PIXELS_PER_SECOND = 60;

type MarqueeLogo = { name: string; logo: string };

export default function LogoMarquee({ items }: { items: MarqueeLogo[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<AnimationPlaybackControls | null>(null);
  const x = useMotionValue(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const distance = track.scrollWidth / 2;
    controlsRef.current = animate(x, -distance, {
      duration: distance / PIXELS_PER_SECOND,
      ease: "linear",
      repeat: Infinity,
    });

    return () => controlsRef.current?.stop();
  }, [x]);

  useEffect(() => {
    if (paused) controlsRef.current?.pause();
    else controlsRef.current?.play();
  }, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <motion.div ref={trackRef} style={{ x }} className="flex w-max items-center gap-16">
        {[...items, ...items].map((item, i) => (
          <div
            key={`${item.name}-${i}`}
            className="relative h-20 w-44 shrink-0 grayscale transition-all duration-300 hover:grayscale-0"
            title={item.name}
          >
            <Image
              src={item.logo}
              alt={item.name}
              fill
              className="object-contain"
              sizes="176px"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
