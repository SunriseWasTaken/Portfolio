"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/lib/data";
import { usePrefersReducedMotion, useIsTouch } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const solidRef = useRef<HTMLHeadingElement>(null);
  const metaTopRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const [glitch, setGlitch] = useState(false);
  const reduced = usePrefersReducedMotion();
  const isTouch = useIsTouch();

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

  // Mouse parallax with perspective
  useEffect(() => {
    if (reduced || isTouch) return;
    const stageEl = stage.current;
    const outline = outlineRef.current;
    const solid = solidRef.current;
    const meta = metaRef.current;
    if (!stageEl || !outline || !solid) return;

    const xSolid = gsap.quickTo(solid, "x", { duration: 0.8, ease: "power3" });
    const ySolid = gsap.quickTo(solid, "y", { duration: 0.8, ease: "power3" });
    const rxSolid = gsap.quickTo(solid, "rotationX", { duration: 0.9, ease: "power3" });
    const rySolid = gsap.quickTo(solid, "rotationY", { duration: 0.9, ease: "power3" });
    const xOut = gsap.quickTo(outline, "x", { duration: 1.1, ease: "power3" });
    const yOut = gsap.quickTo(outline, "y", { duration: 1.1, ease: "power3" });
    const metaTop = metaTopRef.current;
    const xMeta = meta ? gsap.quickTo(meta, "x", { duration: 1, ease: "power3" }) : null;
    const xMetaTop = metaTop ? gsap.quickTo(metaTop, "x", { duration: 1, ease: "power3" }) : null;

    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      xSolid(nx * 34);
      ySolid(ny * 22);
      rySolid(nx * 10);
      rxSolid(-ny * 8);
      xOut(nx * -60);
      yOut(ny * -40);
      if (xMeta) xMeta(nx * 16);
      if (xMetaTop) xMetaTop(nx * 16);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, isTouch]);

  // Scroll-driven separation: the two type layers slide apart to reveal content
  useEffect(() => {
    if (reduced) return;
    const el = root.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Intro (all breakpoints)
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });
      intro
        .from(metaTopRef.current, { y: 20, opacity: 0, duration: 0.9 })
        .from(solidRef.current, { yPercent: 18, opacity: 0, duration: 1.1 }, "-=0.5")
        .from(outlineRef.current, { scale: 1.14, opacity: 0, duration: 1.3 }, "<")
        .from(
          metaRef.current ? metaRef.current.children : [],
          { y: 26, opacity: 0, stagger: 0.12, duration: 0.9 },
          "-=0.8"
        )
        .from(cueRef.current, { opacity: 0, y: 10, duration: 0.8 }, "-=0.5");

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
        tl.to(solidRef.current, { yPercent: -34, scale: 0.72, opacity: 0.12, ease: "power2.in" }, 0)
          .to(outlineRef.current, { yPercent: 42, scale: 1.35, opacity: 0, ease: "power2.in" }, 0)
          .to(metaTopRef.current, { yPercent: -120, opacity: 0, ease: "power2.in" }, 0)
          .to(metaRef.current, { yPercent: 60, opacity: 0, ease: "power2.in" }, 0)
          .to(cueRef.current, { opacity: 0, duration: 0.2 }, 0);
      });

      // On small screens, gently fade the hero as it scrolls away (no pin).
      mm.add("(max-width: 767px)", () => {
        gsap.to(stage.current, {
          opacity: 0.15,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
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
        {/* Outlined giant word behind */}
        <div
          ref={outlineRef}
          aria-hidden
          className="preserve-3d pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
        >
          <span
            className="select-none font-display font-bold leading-none tracking-tightest text-transparent"
            style={{
              WebkitTextStroke: "1.5px rgba(255,255,255,0.14)",
              fontSize: "clamp(7rem, 34vw, 30rem)",
            }}
          >
            {profile.last}
          </span>
        </div>

        {/* Center content */}
        <div className="preserve-3d relative z-10 flex flex-col items-center px-6 text-center">
          <div ref={metaTopRef} className="flex flex-col items-center">
            <p className="eyebrow mb-6 flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent-cyan shadow-[0_0_12px_2px_rgba(110,231,255,0.7)]" />
              Available for select work · {profile.location}
            </p>
          </div>

          <h1
            ref={solidRef}
            data-text={profile.last}
            data-active={glitch}
            className="glitch preserve-3d select-none font-display font-bold leading-[0.82] tracking-tightest will-change-transform"
            style={{ fontSize: "clamp(4.5rem, 20vw, 17rem)" }}
          >
            <span className="text-gradient">{profile.last}</span>
          </h1>

          <div ref={metaRef} className="mt-8 flex max-w-xl flex-col items-center gap-5">
            <p className="font-display text-lg font-medium tracking-tight text-white/90 sm:text-2xl">
              {profile.role}
            </p>
            <p className="max-w-md text-balance text-sm leading-relaxed text-white/55 sm:text-base">
              {profile.summary}
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          ref={cueRef}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40"
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
