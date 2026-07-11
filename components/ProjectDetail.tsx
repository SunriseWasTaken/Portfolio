"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/data";

function Section({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="eyebrow mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
      {children}
    </p>
  );
}

export default function ProjectDetail({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  // Lock background scroll + pause smooth scroll while the immersive view is open
  useEffect(() => {
    window.dispatchEvent(new Event("lenis:stop"));
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.dispatchEvent(new Event("lenis:start"));
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[80] overflow-hidden"
      initial={{ backgroundColor: "rgba(5,6,10,0)" }}
      animate={{ backgroundColor: "rgba(5,6,10,0.9)" }}
      exit={{ backgroundColor: "rgba(5,6,10,0)" }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        layoutId={`project-shell-${project.id}`}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden no-scrollbar"
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      >
        <motion.div
          layoutId={`project-frame-${project.id}`}
          className="relative min-h-full"
          style={{ background: "#05060a" }}
        >
          {/* Hero */}
          <div className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
            <motion.img
              layoutId={`project-image-${project.id}`}
              src={project.cover}
              alt={project.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
            <div
              className="absolute inset-0 opacity-60"
              style={{ background: `radial-gradient(900px circle at 20% 10%, ${project.accent}30, transparent 55%)` }}
            />

            <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-5 pb-10 sm:pb-14">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-ink"
                style={{ background: project.accent }}
              >
                {project.category} · {project.year}
              </motion.span>
              <motion.h2
                layoutId={`project-title-${project.id}`}
                className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl"
              >
                {project.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-4 max-w-xl text-lg text-white/70"
              >
                {project.tagline}
              </motion.p>
            </div>
          </div>

          {/* Body */}
          <div className="mx-auto max-w-5xl px-5 pb-32 pt-14">
            {/* Meta bar */}
            <Section className="mb-16 grid grid-cols-2 gap-6 border-y border-white/10 py-8 sm:grid-cols-4">
              {[
                { k: "Role", v: project.role },
                { k: "Timeline", v: `${project.timeline[0].date} — ${project.timeline[project.timeline.length - 1].date}` },
                { k: "Category", v: project.category },
                { k: "Year", v: project.year },
              ].map((m) => (
                <div key={m.k}>
                  <p className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">{m.k}</p>
                  <p className="mt-1.5 text-sm text-white/85">{m.v}</p>
                </div>
              ))}
            </Section>

            {/* Overview */}
            <Section className="mb-20">
              <Label>Overview</Label>
              <p className="max-w-3xl text-balance font-display text-2xl font-medium leading-snug tracking-tight text-white/90 sm:text-3xl">
                {project.overview}
              </p>
            </Section>

            {/* Metrics */}
            <Section className="mb-20 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="glass rounded-2xl p-6">
                  <p
                    className="font-display text-4xl font-bold tracking-tight sm:text-5xl"
                    style={{ color: project.accent }}
                  >
                    {m.value}
                  </p>
                  <p className="mt-2 text-sm text-white/55">{m.label}</p>
                </div>
              ))}
            </Section>

            {/* Problem / Solution */}
            <div className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-2">
              <Section>
                <Label>The Problem</Label>
                <p className="text-lg leading-relaxed text-white/70">{project.problem}</p>
              </Section>
              <Section delay={0.1}>
                <Label>The Solution</Label>
                <p className="text-lg leading-relaxed text-white/70">{project.solution}</p>
              </Section>
            </div>

            {/* Key features */}
            <Section className="mb-20">
              <Label>Key Features</Label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {project.features.map((f, i) => (
                  <div key={i} className="glass flex items-start gap-3 rounded-2xl p-5">
                    <span
                      className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full font-mono text-xs text-ink"
                      style={{ background: project.accent }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-white/75">{f}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Development process */}
            <Section className="mb-20">
              <Label>Development Process</Label>
              <div className="relative ml-3 border-l border-white/12 pl-8">
                {project.process.map((step, i) => (
                  <div key={i} className="relative pb-9 last:pb-0">
                    <span
                      className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-ink"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: project.accent }} />
                    </span>
                    <h4 className="font-display text-lg font-semibold text-white">{step.phase}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{step.detail}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Challenges */}
            <Section className="mb-20">
              <Label>Challenges</Label>
              <ul className="space-y-3">
                {project.challenges.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full" style={{ background: project.accent }} />
                    <span className="leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Tech stack */}
            <Section className="mb-20">
              <Label>Technologies Used</Label>
              <div className="flex flex-wrap gap-2.5">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="glass rounded-full px-4 py-2 font-mono text-xs text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Section>

            {/* Gallery */}
            <Section className="mb-20">
              <Label>Gallery</Label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.gallery.map((g, i) => (
                  <div
                    key={i}
                    className={`group overflow-hidden rounded-2xl border border-white/10 ${
                      i === 0 ? "sm:col-span-2" : ""
                    }`}
                  >
                    <img
                      src={g}
                      alt={`${project.title} screenshot ${i + 1}`}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </Section>

            {/* Timeline */}
            <Section className="mb-20">
              <Label>Project Timeline</Label>
              <div className="flex flex-col gap-px overflow-hidden rounded-2xl border border-white/10">
                {project.timeline.map((t, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/[0.03] px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] text-ink"
                        style={{ background: t.done ? project.accent : "rgba(255,255,255,0.2)" }}
                      >
                        {t.done ? "✓" : i + 1}
                      </span>
                      <span className="text-sm text-white/80">{t.label}</span>
                    </div>
                    <span className="font-mono text-xs text-white/45">{t.date}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Links */}
            <Section className="flex flex-wrap gap-4">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.03]"
                >
                  Live Demo
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/85 transition-colors hover:border-white/40 hover:bg-white/5"
                >
                  GitHub Repository
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" />
                  </svg>
                </a>
              )}
            </Section>
          </div>
        </motion.div>
      </motion.div>

      {/* Close / back control (outside the morphing shell so it fades independently) */}
      <motion.button
        onClick={onClose}
        data-cursor="hover"
        aria-label="Close project"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ delay: 0.2 }}
        className="glass-strong fixed right-5 top-5 z-[90] flex h-11 items-center gap-2 rounded-full px-4 text-sm text-white/90 hover:text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Close
      </motion.button>
    </motion.div>
  );
}
