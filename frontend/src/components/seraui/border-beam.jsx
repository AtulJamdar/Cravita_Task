"use client";

import { cn } from "./utils";
import { motion,  } from "motion/react";
import { forwardRef, useMemo } from "react";



export const BorderBeam = forwardRef(
  (
    {
      className,
      size = 50,
      delay = 0,
      duration = 6,
      colorFrom = "#ffaa40",
      colorTo = "#9c40ff",
      transition,
      style,
      reverse = false,
      initialOffset = 0,
      paused = false,
      borderRadius = "auto",
      opacity = 1,
    },
    ref,
  ) => {
    // Memoize the offset path to prevent unnecessary recalculations
    const offsetPath = useMemo(() => {
      const radius = borderRadius === "auto" ? size : borderRadius;
      return `rect(0 auto auto 0 round ${radius}px)`;
    }, [borderRadius, size]);

    // Memoize the animation values
    const animationValues = useMemo(() => {
      const start = `${initialOffset}%`;
      const end = reverse
        ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
        : [`${initialOffset}%`, `${100 + initialOffset}%`];
      return { start, end };
    }, [initialOffset, reverse]);

    // Memoize the transition configuration
    const transitionConfig = useMemo(() => ({
      repeat: paused ? 0 : Infinity,
      ease: "linear" ,
      duration,
      delay: -delay,
      ...transition,
    }), [paused, duration, delay, transition]);

    return (
      <div
        ref={ref}
        className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
        role="presentation"
        aria-hidden="true"
      >
        <motion.div
          className={cn(
            "absolute aspect-square",
            "bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent",
            className,
          )}
          style={
            {
              width: size,
              offsetPath,
              "--color-from": colorFrom,
              "--color-to": colorTo,
              opacity,
              ...style,
            } 
          }
          initial={{ offsetDistance: animationValues.start }}
          animate={{
            offsetDistance: animationValues.end,
          }}
          transition={transitionConfig}
        />
      </div>
    );
  },
);

BorderBeam.displayName = "BorderBeam"; 