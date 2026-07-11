"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/lib/data";
import { usePrefersReducedMotion, useIsTouch } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Number of outlined copies stacked behind the solid word (the extrusion depth).
const LAYERS = 9;

function lerp(a: number, b: number, t: number) {
  return Math.round(a + (b - a) * t);
}
function hex(r: number, g: number, b: number) {
  return `rgb(${r}, ${g}, ${b})`;
}
/** Interpolate cyan -> violet -> magenta across the extrusion depth. */
function depthColor(t: number) {
  const cyan = [110, 231, 255];
  const violet = [167, 139, 250];
  const magenta = [244, 114, 182];
  if (t < 0.5) {
    const k = t / 0.5;
    return hex(lerp(cyan[0], violet[0], k), lerp(cyan[1], violet[1], k), lerp(cyan[2], violet[2], k));
  }
  const k = (t - 0.5) / 0.5;
  return hex(lerp(violet[0], magenta[0], k), lerp(violet[1], magenta[1], k), lerp(violet[2], magenta[2], k));
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const solidRef = useRef<HTMLHeadingElement>(null);
  const metaTopRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [glitch, setGlitch] = useState(false);
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouch();
  const word = profile.last;

  const layers = useMemo(
    () =>
      Array.from({ length: LAYERS }, (_, i) => {
        const t = i / (LAYERS - 1);
        return {
          z: -(i + 1) * 26,
          color: depthColor(t),
          opacity: 0.5 * (1 - t) + 0.06,
          stroke: 1.5 - t * 0.7,
        };
      }),
    []
  );

  // Occasional, restrained glitch
  useEffect(() => {
    if (reduced) return;
    let timeout: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeout = setTimeout(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 480);
        schedule();
      }, 3500 + Math.random() * 5000);
    };
    schedule();
    return () => clearTimeout(timeout);
  }, [reduced]);

  // Mouse parallax — tilts the whole 3D scene so the extrusion fans out, and
  // pushes the solid word and outline stack in opposite directions for depth.
  useEffect(() => {
    if (reduced || isTouch) return;
    const tilt = tiltRef.current;
    const solid = solidRef.current;
    const stackEl = stackRef.current;
    if (!tilt || !solid || !stackEl) return;

    const ryTilt = gsap.quickTo(tilt, "rotationY", { duration: 0.9, ease: "power3" });
    const rxTilt = gsap.quickTo(tilt, "rotationX", { duration: 0.9, ease: "power3" });
    const xSolid = gsap.quickTo(solid, "x", { duration: 0.8, ease: "power3" });
    const ySolid = gsap.quickTo(solid, "y", { duration: 0.8, ease: "power3" });
    const xStack = gsap.quickTo(stackEl, "x", { duration: 1.1, ease: "power3" });
    const yStack = gsap.quickTo(stackEl, "y", { duration: 1.1, ease: "power3" });
    const xMeta = metaRef.current ? gsap.quickTo(metaRef.current, "x", { duration: 1, ease: "power3" }) : null;

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      ryTilt(nx * 18);
      rxTilt(-ny * 12);
      xSolid(nx * 24);
      ySolid(ny * 16);
      xStack(nx * -34);
      yStack(ny * -22);
      if (xMeta) xMeta(nx * 14);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, isTouch]);

  // Intro + continuous idle motion + scroll-driven separation
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Intro
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .from(sceneRef.current, { opacity: 0, scale: 1.25, duration: 1.3 })
        .from(metaTopRef.current, { y: 20, opacity: 0, duration: 0.9 }, "-=0.9")
        .from(
          metaRef.current ? metaRef.current.children : [],
          { y: 26, opacity: 0, stagger: 0.12, duration: 0.9 },
          "-=0.8"
        )
        .from(cueRef.current, { opacity: 0, y: 10, duration: 0.8 }, "-=0.5");

      // Idle: the extruded stack swings continuously so the outline series
      // is always moving dynamically (Twitch-style).
      gsap.fromTo(
        sceneRef.current,
        { rotationY: -9, rotationX: 4 },
        { rotationY: 9, rotationX: -4, duration: 5.5, yoyo: true, repeat: -1, ease: "sine.inOut" }
      );

      // Pinned scroll-separation only on larger screens; mobile stays light.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=110%",
            scrub: 1,
            pin: stage.current,
            pinSpacing: true,
          },
        });
        tl.to(solidRef.current, { yPercent: -32, scale: 0.72, opacity: 0.12, ease: "power2.in" }, 0)
          .to(stackRef.current, { scale: 1.55, opacity: 0, ease: "power2.in" }, 0)
          .to(metaTopRef.current, { yPercent: -120, opacity: 0, ease: "power2.in" }, 0)
          .to(metaRef.current, { yPercent: 60, opacity: 0, ease: "power2.in" }, 0)
          .to(cueRef.current, { opacity: 0, duration: 0.2 }, 0);
      });

      mm.add("(max-width: 767px)", () => {
        gsap.to(stage.current, {
          opacity: 0.12,
          scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="home" ref={root} className="relative">
      <div
        ref={stage}
        className="perspective relative flex h-[100svh] min-h-[600px] w-full items-center justify-center overflow-hidden"
      >
        {/* 3D extruded identity */}
        <div
          ref={sceneRef}
          className="preserve-3d absolute inset-0 flex items-center justify-center will-change-transform"
        >
          <div
            ref={tiltRef}
            className="preserve-3d relative flex items-center justify-center will-change-transform"
          >
            {/* Outline extrusion: a receding series of the same word */}
            <div
              ref={stackRef}
              aria-hidden
              className="preserve-3d pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
            >
              {layers.map((l, i) => (
                <span
                  key={i}
                  className="hero-word absolute left-1/2 top-1/2 select-none"
                  style={{
                    transform: `translate(-50%, -50%) translateZ(${l.z}px)`,
                    opacity: l.opacity,
                    WebkitTextStroke: `${l.stroke}px ${l.color}`,
                    color: "transparent",
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Main solid word, front of the extrusion */}
            <h1
              ref={solidRef}
              data-text={word}
              data-active={glitch}
              className="glitch hero-word relative z-10 select-none will-change-transform"
            >
              <span className="text-gradient">{word}</span>
            </h1>
          </div>
        </div>

        {/* Meta — framed above and below the identity */}
        <div
          ref={metaTopRef}
          className="absolute inset-x-0 top-[15%] z-20 flex justify-center px-6"
        >
          <p className="eyebrow flex items-center gap-3 text-center">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_12px_2px_rgba(110,231,255,0.7)]" />
            Available for select work · {profile.location}
          </p>
        </div>

        <div
          ref={metaRef}
          className="absolute inset-x-0 bottom-[13%] z-20 flex flex-col items-center gap-4 px-6 text-center"
        >
          <p className="font-display text-lg font-medium tracking-tight text-white/90 sm:text-2xl">
            {profile.role}
          </p>
          <p className="max-w-md text-balance text-sm leading-relaxed text-white/55 sm:text-base">
            {profile.summary}
          </p>
        </div>

        {/* Scroll cue */}
        <div
          ref={cueRef}
          className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40"
        >
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.3em]">Scroll</span>
          <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
            <span className="h-2 w-1 animate-bounce rounded-full bg-white/60" />
          </span>
        </div>
      </div>
    </section>
  );
}
