"use client";

import { projects, type Project } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";

export default function Projects({ onOpen }: { onOpen: (p: Project) => void }) {
  return (
    <section id="work" className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
      <Reveal className="mb-14 flex flex-col gap-4 sm:mb-20">
        <p className="eyebrow">01 — Selected Work</p>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Projects built to <span className="text-gradient">feel</span> as good as they perform.
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            A selection of platforms, tools, and experiences. Tap any card to expand the full story.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {projects.map((p, i) => (
          <div key={p.id} className={i % 2 === 1 ? "md:mt-16" : ""}>
            <ProjectCard project={p} index={i} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </section>
  );
}
