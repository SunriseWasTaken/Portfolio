"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { profile } from "@/lib/data";
import { Reveal } from "@/components/Reveal";
import { usePrefersReducedMotion } from "@/lib/hooks";

const bootLines = [
  { p: "rafi@london", c: "whoami", out: `${profile.name} — ${profile.role}` },
  { p: "rafi@london", c: "cat status.txt", out: "◦ Graduate open to software engineering roles & interesting problems." },
  { p: "rafi@london", c: "locate", out: `${profile.location} · open to relocation / remote` },
];

function useTypewriter(text: string, start: boolean, speed = 22) {
  const [out, setOut] = useState("");
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setOut(text);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, start, speed, reduced]);
  return out;
}

function BootLine({ line, start, delay }: { line: (typeof bootLines)[number]; start: boolean; delay: number }) {
  const [begin, setBegin] = useState(false);
  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setBegin(true), delay);
    return () => clearTimeout(t);
  }, [start, delay]);
  const typed = useTypewriter(line.c, begin);
  const done = typed === line.c;
  return (
    <div className="mb-3">
      <p className="flex flex-wrap items-center gap-2">
        <span className="text-accent-cyan">{line.p}</span>
        <span className="text-white/40">:~$</span>
        <span className="text-white/90">{typed}</span>
      </p>
      {done && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-1 pl-1 text-white/55"
        >
          {line.out}
        </motion.p>
      )}
    </div>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name || "a visitor"}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}${form.email ? ` (${form.email})` : ""}`
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section id="contact" className="relative mx-auto max-w-5xl px-5 py-24 sm:py-32">
      <Reveal className="mb-12 flex flex-col items-center gap-4 text-center">
        <p className="eyebrow">04 — Contact</p>
        <h2 className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Let&apos;s build something <span className="text-gradient">worth shipping</span>.
        </h2>
      </Reveal>

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50, rotateX: 8 }}
        animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong overflow-hidden rounded-2xl shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <span className="ml-3 font-mono text-xs text-white/45">
            — bash — {profile.email} —
          </span>
        </div>

        <div className="grid grid-cols-1 gap-8 p-6 font-mono text-sm sm:p-8 md:grid-cols-2">
          {/* Left: boot output */}
          <div>
            {bootLines.map((l, i) => (
              <BootLine key={i} line={l} start={inView} delay={i * 900} />
            ))}
            <div className="mt-6">
              <p className="text-white/40"># reach me directly</p>
              <ul className="mt-2 space-y-1.5">
                {profile.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target={s.url.startsWith("mailto") ? undefined : "_blank"}
                      rel="noreferrer"
                      data-cursor="hover"
                      className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-accent-cyan"
                    >
                      <span className="text-accent-violet">→</span>
                      <span className="w-20 text-white/45">{s.label}</span>
                      <span className="underline decoration-white/20 underline-offset-4 group-hover:decoration-accent-cyan">
                        {s.handle}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: interactive form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <p className="text-white/40"># send a message</p>

            {(["name", "email"] as const).map((field) => (
              <label key={field} className="block">
                <span className="mb-1.5 block text-xs text-white/40">
                  visitor@rafi:~$ set {field}
                </span>
                <div className="flex items-center gap-2 rounded-lg border border-white/12 bg-black/30 px-3 py-2.5 transition-colors focus-within:border-accent-cyan/60">
                  <span className="text-accent-cyan">$</span>
                  <input
                    type={field === "email" ? "email" : "text"}
                    required
                    value={form[field]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    placeholder={field === "email" ? "you@domain.com" : "your name"}
                    className="w-full bg-transparent text-white placeholder:text-white/25 focus:outline-none"
                    autoComplete={field === "email" ? "email" : "name"}
                  />
                </div>
              </label>
            ))}

            <label className="block">
              <span className="mb-1.5 block text-xs text-white/40">
                visitor@rafi:~$ compose message
              </span>
              <div className="flex gap-2 rounded-lg border border-white/12 bg-black/30 px-3 py-2.5 transition-colors focus-within:border-accent-cyan/60">
                <span className="text-accent-cyan">$</span>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="what should we build?"
                  className="w-full resize-none bg-transparent text-white placeholder:text-white/25 focus:outline-none"
                />
              </div>
            </label>

            <button
              type="submit"
              data-cursor="hover"
              className="group mt-1 flex items-center justify-center gap-2 rounded-lg bg-white py-3 font-semibold text-ink transition-transform duration-300 hover:scale-[1.02]"
            >
              {sent ? "$ message dispatched ✓" : "$ ./send-message"}
              <span className="inline-block h-4 w-2 animate-caret-blink bg-ink group-hover:bg-ink" aria-hidden />
            </button>
          </form>
        </div>
      </motion.div>

      <footer className="mt-20 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-center text-sm text-white/40 sm:flex-row sm:justify-between sm:text-left">
        <p>© {new Date().getFullYear()} {profile.name}. Crafted with intent.</p>
        <p className="font-mono text-xs">Next.js · GSAP · Framer Motion · Tailwind</p>
      </footer>
    </section>
  );
}
