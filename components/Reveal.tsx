"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";

const base: Variants = {
  hidden: { opacity: 0, y: 34, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  y = 34,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section";
  y?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: { opacity: 0, y, filter: "blur(6px)" },
        show: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggers direct children into view. Wrap items in <RevealItem/>.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.09,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: 0.05 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={base}>
      {children}
    </motion.div>
  );
}
