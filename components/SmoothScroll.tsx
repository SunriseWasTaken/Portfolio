"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wires Lenis smooth scrolling into GSAP's ScrollTrigger so pinned, scrubbed
 * animations stay perfectly in sync with the inertial scroll. Disabled entirely
 * when the user prefers reduced motion.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Refresh once fonts/layout settle
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 400);
    window.addEventListener("load", refresh);

    // Allow overlays (project detail) to pause/resume scrolling
    const stop = () => lenis.stop();
    const start = () => lenis.start();
    window.addEventListener("lenis:stop", stop);
    window.addEventListener("lenis:start", start);

    return () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh);
      window.removeEventListener("lenis:stop", stop);
      window.removeEventListener("lenis:start", start);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
