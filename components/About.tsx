"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { milestones, profile, type Milestone } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

const kindMeta: Record<Milestone["kind"], { label: string; color: string }> = {
  education: { label: "Education", color: "#6ee7ff" },
  internship: { label: "Internship", color: "#a78bfa" },
  hackathon: { label: "Hackathon", color: "#c6ff5e" },
  work: { label: "Work", color: "#f472b6" },
  project: { label: "Project", color: "#fbbf24" },
};

function Node({ m, i }: { m: Milestone; i: number }) {
  const meta = kindMeta[m.kind];
  const left = i % 2 === 0;
  return (
    <div className="relative flex w-full items-center md:justify-center">
      <motion.div
        initial={{ opacity: 0, x: left ? -50 : 50, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`ml-16 w-full md:ml-0 md:w-[calc(50%-2.5rem)] ${
          left ? "md:mr-auto md:pr-10 md:text-right" : "md:ml-auto md:pl-10"
        }`}
      >
        <div className="glass group rounded-2xl p-6 transition-colors duration-500 hover:border-white/25">
          <div className={`flex items-center gap-3 ${left ? "md:justify-end" : ""}`}>
            <span
              className="rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-widest"
              style={{ color: meta.color, background: `${meta.color}1a` }}
            >
              {meta.label}
            </span>
            <span className="font-mono text-sm text-white/45">{m.year}</span>
          </div>
          <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-white">
            {m.title}
          </h3>
          <p className="mt-0.5 text-sm font-medium" style={{ color: meta.color }}>
            {m.org}
          </p>
          <p className="mt-2.5 text-sm leading-relaxed text-white/55">{m.detail}</p>
        </div>
      </motion.div>

      {/* Node dot on the spine */}
      <span className="absolute left-6 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-1/2">
        <span
          className="h-3 w-3 rounded-full border-2 border-ink"
          style={{ background: meta.color, boxShadow: `0 0 16px 2px ${meta.color}88` }}
        />
      </span>
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 65%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:h-fit">
          <p className="eyebrow">02 — About</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            From ideas to <span className="text-gradient">real-world impact</span>.
          </h2>
          <div className="mt-6 flex max-w-md flex-col gap-4 leading-relaxed text-white/60">
            {profile.about.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {Object.values(kindMeta).map((k) => (
              <span
                key={k.label}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: k.color }} />
                {k.label}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Timeline */}
        <div ref={ref} className="relative py-2">
          {/* Spine track */}
          <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-1/2" />
          {/* Animated fill */}
          <motion.div
            style={{ scaleY, transformOrigin: "top" }}
            className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-accent-cyan via-accent-violet to-accent-magenta md:left-1/2"
          />
          <motion.div
            style={{ top: glowY }}
            className="absolute left-6 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_20px_6px_rgba(110,231,255,0.7)] md:left-1/2"
          />

          <div className="flex flex-col gap-12">
            {milestones.map((m, i) => (
              <Node key={m.year + m.title} m={m} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
