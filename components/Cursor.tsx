"use client";

import { useEffect, useRef } from "react";
import { useIsTouch } from "@/lib/hooks";

/**
 * A dual-layer custom cursor: a precise dot that tracks 1:1 and a soft ring
 * that trails with easing. The ring grows and shifts color over interactive
 * elements (anything marked data-cursor="hover" or native links/buttons).
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();

  useEffect(() => {
    if (isTouch) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [data-cursor="hover"], input, textarea, [role="button"]'
      );
      ring.dataset.variant = interactive ? "hover" : "";
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    const onLeave = () => (ring.dataset.variant = "hidden");
    const onEnter = () => (ring.dataset.variant = "");

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}
