"use client";

import { motion } from "framer-motion";
import type { Project } from "@/lib/data";

export default function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (p: Project) => void;
}) {
  return (
    <motion.article
      layoutId={`project-shell-${project.id}`}
      onClick={() => onOpen(project)}
      data-cursor="hover"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.08 }}
      className="group relative cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(project);
        }
      }}
    >
      {/* Hover lift is applied to children only; the layoutId frame itself keeps
          its transform free for the shared-element expansion. */}
      <div className="transition-transform duration-500 ease-smooth group-hover:-translate-y-1.5">
        <motion.div
          layoutId={`project-frame-${project.id}`}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-2 transition-all duration-500 group-hover:border-white/25 group-hover:shadow-[0_30px_80px_-30px_rgba(110,231,255,0.35)]"
        >
          {/* glow ring on hover */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: `radial-gradient(600px circle at 50% 0%, ${project.accent}22, transparent 60%)`,
            }}
          />

          <div className="relative overflow-hidden rounded-2xl">
            <motion.img
              layoutId={`project-image-${project.id}`}
              src={project.cover}
              alt={project.title}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover transition-transform duration-[1200ms] ease-smooth group-hover:scale-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />

            {/* top row meta */}
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span
                className="rounded-full px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-widest text-ink"
                style={{ background: project.accent }}
              >
                {project.category}
              </span>
            </div>
            <span className="absolute right-4 top-4 font-mono text-xs text-white/60">
              {project.year}
            </span>
          </div>

          <div className="relative flex items-end justify-between gap-4 px-3 pb-3 pt-5">
            <div>
              <motion.h3
                layoutId={`project-title-${project.id}`}
                className="font-display text-2xl font-semibold tracking-tight text-white transition-transform duration-500 group-hover:translate-x-1"
              >
                {project.title}
              </motion.h3>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/55">
                {project.description}
              </p>
            </div>
            <span
              className="mb-1 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-white/15 text-white/70 transition-all duration-500 group-hover:border-white/40 group-hover:bg-white/10"
              aria-hidden
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform duration-500 group-hover:rotate-45">
                <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
}
