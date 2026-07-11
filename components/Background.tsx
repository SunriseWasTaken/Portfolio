"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };

/**
 * The living backdrop. Three cooperating layers:
 *  1. CSS gradient orbs that slowly drift (below, via markup).
 *  2. A canvas particle field with faint constellation links that parallax to
 *     the pointer.
 *  3. An animated grid + noise (via utility classes) layered on top.
 * The canvas throttles to the device pixel ratio, pauses when hidden, and is
 * skipped entirely under reduced-motion.
 */
export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles: P[] = [];
    let raf = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = w < 640 ? 34 : w < 1200 ? 60 : 92;
      particles = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.6 + 0.4,
        a: Math.random() * 0.5 + 0.2,
      }));
    };

    const onMove = (e: MouseEvent) => {
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
    };

    const linkDist = w < 640 ? 90 : 130;

    const draw = () => {
      if (!running) return;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // gentle pointer attraction / parallax
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 24000) {
          const f = (1 - d2 / 24000) * 0.4;
          p.x += (dx / Math.sqrt(d2 + 1)) * f;
          p.y += (dy / Math.sqrt(d2 + 1)) * f;
        }

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 220, 255, ${p.a})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ddx = p.x - q.x;
          const ddy = p.y - q.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.14;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(120, 180, 255, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        raf = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(raf);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink">
      {/* Drifting gradient orbs */}
      <div className="absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(110,231,255,0.16),transparent_60%)] animate-float" />
        <div
          className="absolute -right-40 top-1/4 h-[50vw] w-[50vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.16),transparent_60%)] animate-float"
          style={{ animationDelay: "-2s", animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-[-20%] left-1/3 h-[45vw] w-[45vw] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.12),transparent_60%)] animate-float"
          style={{ animationDelay: "-4s", animationDuration: "10s" }}
        />
      </div>

      {/* Animated fine grid */}
      <div className="absolute inset-0 grid-lines animate-grid-drift mask-fade-y opacity-70" />

      {/* Particle constellation */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Vignette to focus the center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,6,10,0.7)_100%)]" />
    </div>
  );
}
