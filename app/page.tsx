"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup } from "framer-motion";
import type { Project } from "@/lib/data";
import Background from "@/components/Background";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import ProjectDetail from "@/components/ProjectDetail";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";

export default function Home() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <SmoothScroll>
      <Background />
      <Cursor />
      <div className="noise" aria-hidden />

      <LayoutGroup>
        <Nav locked={!!active} />

        <main className="relative">
          <Hero />

          {/* Continuous transition: work rises out of the hero */}
          <div className="relative z-10 bg-gradient-to-b from-transparent via-ink/60 to-ink">
            <Projects onOpen={setActive} />
            <div className="hairline mx-auto max-w-6xl" />
            <About />
            <div className="hairline mx-auto max-w-6xl" />
            <Skills />
            <div className="hairline mx-auto max-w-6xl" />
            <Contact />
          </div>
        </main>

        <AnimatePresence>
          {active && (
            <ProjectDetail
              key={active.id}
              project={active}
              onClose={() => setActive(null)}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </SmoothScroll>
  );
}
