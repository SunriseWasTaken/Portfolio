"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { skills, projects, type Skill } from "@/lib/data";
import { Reveal } from "@/components/Reveal";

const groupColor: Record<Skill["group"], string> = {
  language: "#6ee7ff",
  frontend: "#a78bfa",
  backend: "#f472b6",
  infra: "#fbbf24",
  creative: "#c6ff5e",
};

const groupOrder: Skill["group"][] = ["language", "frontend", "creative", "backend", "infra"];

type Pos = { x: number; y: number };

function useLayout(): Record<string, Pos> {
  return useMemo(() => {
    const positions: Record<string, Pos> = {};
    const byGroup = groupOrder.map((g) => skills.filter((s) => s.group === g));
    byGroup.forEach((groupSkills, gi) => {
      const angle = (gi / groupOrder.length) * Math.PI * 2 - Math.PI / 2;
      const gx = 50 + Math.cos(angle) * 30;
      const gy = 50 + Math.sin(angle) * 30;
      groupSkills.forEach((s, si) => {
        const a = (si / Math.max(groupSkills.length, 1)) * Math.PI * 2;
        const r = groupSkills.length > 1 ? 13 : 0;
        positions[s.id] = {
          x: Math.max(8, Math.min(92, gx + Math.cos(a) * r)),
          y: Math.max(10, Math.min(90, gy + Math.sin(a) * r)),
        };
      });
    });
    return positions;
  }, []);
}

export default function Skills() {
  const layout = useLayout();
  const [active, setActive] = useState<string | null>(null);

  const activeSkill = active ? skills.find((s) => s.id === active) ?? null : null;
  const highlighted = useMemo(() => {
    if (!activeSkill) return new Set<string>();
    return new Set<string>([activeSkill.id, ...activeSkill.related]);
  }, [activeSkill]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const list: { a: string; b: string }[] = [];
    for (const s of skills) {
      for (const r of s.related) {
        const key = [s.id, r].sort().join("-");
        if (seen.has(key) || !layout[r]) continue;
        seen.add(key);
        list.push({ a: s.id, b: r });
      }
    }
    return list;
  }, [layout]);

  const relatedProjects = activeSkill
    ? projects.filter((p) => activeSkill.projects.includes(p.id))
    : [];

  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-5 py-24 sm:py-32">
      <Reveal className="mb-12 flex flex-col gap-4">
        <p className="eyebrow">03 — Capabilities</p>
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            A connected <span className="text-gradient">stack</span>, not a checklist.
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Hover or tap a node to trace how each technology relates to the others — and the projects it shipped.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        {/* Network */}
        <Reveal className="glass relative aspect-square w-full overflow-hidden rounded-3xl sm:aspect-[4/3]">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
          >
            {edges.map((e, i) => {
              const pa = layout[e.a];
              const pb = layout[e.b];
              if (!pa || !pb) return null;
              const lit = highlighted.has(e.a) && highlighted.has(e.b);
              const dim = active && !lit;
              return (
                <line
                  key={i}
                  x1={pa.x}
                  y1={pa.y}
                  x2={pb.x}
                  y2={pb.y}
                  stroke={lit ? "#6ee7ff" : "#ffffff"}
                  strokeOpacity={dim ? 0.04 : lit ? 0.55 : 0.12}
                  strokeWidth={lit ? 0.5 : 0.3}
                  vectorEffect="non-scaling-stroke"
                  style={{ transition: "stroke-opacity 0.35s, stroke 0.35s" }}
                />
              );
            })}
          </svg>

          {skills.map((s) => {
            const p = layout[s.id];
            if (!p) return null;
            const isHi = highlighted.has(s.id);
            const dim = active && !isHi;
            const size = 34 + s.level * 26;
            return (
              <button
                key={s.id}
                data-cursor="hover"
                onMouseEnter={() => setActive(s.id)}
                onFocus={() => setActive(s.id)}
                onMouseLeave={() => setActive(null)}
                onBlur={() => setActive(null)}
                onClick={() => setActive((cur) => (cur === s.id ? null : s.id))}
                className="group absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: size,
                  height: size,
                  opacity: dim ? 0.3 : 1,
                  transition: "opacity 0.35s, transform 0.35s",
                  zIndex: isHi ? 20 : 10,
                }}
              >
                <span
                  className="absolute inset-0 rounded-full border transition-all duration-300"
                  style={{
                    borderColor: groupColor[s.group],
                    background: `${groupColor[s.group]}${isHi ? "33" : "14"}`,
                    boxShadow: active === s.id ? `0 0 26px 4px ${groupColor[s.group]}aa` : "none",
                  }}
                />
                <span
                  className="relative whitespace-nowrap px-1 text-center font-mono text-[0.6rem] font-medium leading-none text-white sm:text-[0.68rem]"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </Reveal>

        {/* Detail panel */}
        <div className="flex flex-col gap-4">
          <div className="glass min-h-[180px] rounded-3xl p-6">
            {activeSkill ? (
              <motion.div
                key={activeSkill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ background: groupColor[activeSkill.group] }}
                  />
                  <h3 className="font-display text-2xl font-semibold text-white">
                    {activeSkill.label}
                  </h3>
                </div>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-white/40">
                  {activeSkill.group} · {Math.round(activeSkill.level * 100)}% fluency
                </p>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${activeSkill.level * 100}%` }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full"
                    style={{ background: groupColor[activeSkill.group] }}
                  />
                </div>
                {relatedProjects.length > 0 && (
                  <div className="mt-5">
                    <p className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">
                      Used in
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {relatedProjects.map((p) => (
                        <span
                          key={p.id}
                          className="rounded-full border border-white/12 px-3 py-1.5 text-xs text-white/75"
                        >
                          {p.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex h-full flex-col justify-center">
                <p className="text-white/70">Explore the network.</p>
                <p className="mt-1 text-sm text-white/45">
                  Hover a node to reveal related skills and the projects they powered.
                </p>
              </div>
            )}
          </div>

          {/* Group legend */}
          <div className="glass rounded-3xl p-6">
            <p className="font-mono text-[0.62rem] uppercase tracking-widest text-white/40">Domains</p>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {groupOrder.map((g) => (
                <div key={g} className="flex items-center gap-2 text-sm capitalize text-white/70">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: groupColor[g] }} />
                  {g}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
