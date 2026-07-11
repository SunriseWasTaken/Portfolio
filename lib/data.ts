export type Project = {
  id: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  category: string;
  description: string;
  accent: string;
  cover: string;
  overview: string;
  problem: string;
  solution: string;
  process: { phase: string; detail: string }[];
  challenges: string[];
  features: string[];
  tech: string[];
  gallery: string[];
  timeline: { label: string; date: string; done?: boolean }[];
  metrics: { value: string; label: string }[];
  links: { github?: string; demo?: string };
};

/**
 * Cover / gallery art is generated as inline SVG data URIs so the experience is
 * fully self-contained and never depends on external image hosts. Each cover is
 * a distinct, on-brand gradient composition.
 */
function art(a: string, b: string, seed: number): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${a}'/>
      <stop offset='1' stop-color='${b}'/>
    </linearGradient>
    <radialGradient id='r' cx='0.3' cy='0.25' r='0.8'>
      <stop offset='0' stop-color='#ffffff' stop-opacity='0.28'/>
      <stop offset='1' stop-color='#ffffff' stop-opacity='0'/>
    </radialGradient>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='${seed}'/>
      <feColorMatrix type='saturate' values='0'/>
      <feComponentTransfer><feFuncA type='linear' slope='0.06'/></feComponentTransfer>
      <feComposite operator='over' in2='SourceGraphic'/>
    </filter>
  </defs>
  <rect width='1200' height='800' fill='#05060a'/>
  <rect width='1200' height='800' fill='url(#g)' opacity='0.85'/>
  <g opacity='0.5' stroke='#ffffff' stroke-opacity='0.14' fill='none'>
    ${Array.from({ length: 9 })
      .map((_, i) => `<circle cx='${300 + seed * 40}' cy='${380}' r='${60 + i * 62}'/>`)
      .join("")}
  </g>
  <rect width='1200' height='800' fill='url(#r)'/>
  <rect width='1200' height='800' filter='url(#n)' opacity='0.5'/>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const projects: Project[] = [
  {
    id: "helios",
    title: "Helios",
    tagline: "Realtime observability for distributed systems",
    year: "2025",
    role: "Lead Engineer",
    category: "Platform",
    accent: "#6ee7ff",
    cover: art("#0ea5e9", "#7c3aed", 3),
    description:
      "A streaming observability platform that renders millions of spans per second into a fluid, explorable timeline.",
    overview:
      "Helios ingests high-cardinality telemetry from thousands of services and turns raw traces into an interactive, cinematic map of a distributed system. Engineers can scrub time, follow a request across service boundaries, and spot anomalies before they page anyone.",
    problem:
      "Existing tracing tools buckled at scale. Dashboards took 20+ seconds to load, correlation across services was manual, and cost grew linearly with traffic — so teams sampled away the very data they needed during incidents.",
    solution:
      "I designed a columnar ingestion pipeline with adaptive sampling and a WebGL-accelerated trace renderer. A tiered storage model keeps hot data in memory and streams cold data on demand, keeping p95 query latency under 400ms at any zoom level.",
    process: [
      { phase: "Discovery", detail: "Shadowed 3 on-call rotations to map the real debugging loop." },
      { phase: "Architecture", detail: "Prototyped a columnar store + streaming diff protocol over WebSocket." },
      { phase: "Build", detail: "Shipped the renderer, query planner, and adaptive sampler incrementally behind flags." },
      { phase: "Rollout", detail: "Migrated 40 services with zero-downtime dual-writes and shadow reads." },
    ],
    challenges: [
      "Rendering 2M+ spans without dropping frames required a custom instanced WebGL layer and off-main-thread layout.",
      "Adaptive sampling had to preserve rare error traces while discarding redundant happy-path data.",
      "Backfilling historical data while serving live queries demanded a careful dual-write migration.",
    ],
    features: [
      "GPU-accelerated trace waterfall that stays 60fps at any scale",
      "Time-scrubbing with sub-second seek across weeks of history",
      "Anomaly ribbons that surface regressions inline",
      "Shareable, deep-linkable investigation sessions",
    ],
    tech: ["TypeScript", "Rust", "WebGL", "ClickHouse", "gRPC", "Kubernetes"],
    gallery: [art("#0ea5e9", "#22d3ee", 11), art("#6d28d9", "#0ea5e9", 12), art("#0891b2", "#4338ca", 13)],
    timeline: [
      { label: "Kickoff & research", date: "Jan 2025", done: true },
      { label: "Ingestion pipeline", date: "Mar 2025", done: true },
      { label: "WebGL renderer", date: "Jun 2025", done: true },
      { label: "GA launch", date: "Oct 2025", done: true },
    ],
    metrics: [
      { value: "2.1M", label: "spans / sec" },
      { value: "380ms", label: "p95 query" },
      { value: "-64%", label: "storage cost" },
    ],
    links: { github: "https://github.com/", demo: "https://example.com/" },
  },
  {
    id: "aurora",
    title: "Aurora",
    tagline: "A design system that ships itself",
    year: "2024",
    role: "Founding Engineer",
    category: "Developer Tools",
    accent: "#a78bfa",
    cover: art("#a78bfa", "#f472b6", 5),
    description:
      "A component platform where design tokens compile straight into production code, docs, and Figma in one pass.",
    overview:
      "Aurora closes the gap between design and engineering. A single source of truth for tokens and components compiles to React, docs, and a synchronized Figma library — so a color change in the morning is live in production by lunch.",
    problem:
      "Design systems drift. Figma, code, and docs slowly diverge until nobody trusts any of them, and every release becomes an archaeology project.",
    solution:
      "I built a token compiler and a headless component contract layer. Designers edit tokens; a pipeline emits typed React components, MDX docs, and a Figma plugin payload — all versioned and diffable in Git.",
    process: [
      { phase: "Audit", detail: "Catalogued 200+ inconsistent components across 6 product surfaces." },
      { phase: "Foundations", detail: "Defined a typed token schema and a headless behavior layer." },
      { phase: "Compiler", detail: "Built the multi-target emitter (React, MDX, Figma)." },
      { phase: "Adoption", detail: "Ran codemods to migrate teams with automated PRs." },
    ],
    challenges: [
      "Keeping accessibility guarantees intact while allowing full visual customization.",
      "Designing a token schema expressive enough for theming yet safe to compile.",
      "Migrating live teams without freezing feature work.",
    ],
    features: [
      "Typed design tokens with light/dark/brand theming",
      "Headless, accessible primitives with full ARIA coverage",
      "Auto-generated, always-accurate documentation",
      "Figma ↔ code sync via a generated plugin",
    ],
    tech: ["TypeScript", "React", "Style Dictionary", "Radix", "Storybook", "Node"],
    gallery: [art("#a78bfa", "#8b5cf6", 21), art("#f472b6", "#a78bfa", 22), art("#7c3aed", "#ec4899", 23)],
    timeline: [
      { label: "System audit", date: "Feb 2024", done: true },
      { label: "Token compiler", date: "May 2024", done: true },
      { label: "Component library", date: "Aug 2024", done: true },
      { label: "Org-wide adoption", date: "Dec 2024", done: true },
    ],
    metrics: [
      { value: "6", label: "product surfaces" },
      { value: "98%", label: "a11y score" },
      { value: "3x", label: "faster delivery" },
    ],
    links: { github: "https://github.com/", demo: "https://example.com/" },
  },
  {
    id: "cadence",
    title: "Cadence",
    tagline: "Generative music, tuned by your motion",
    year: "2024",
    role: "Creative Technologist",
    category: "Interactive",
    accent: "#c6ff5e",
    cover: art("#22c55e", "#0ea5e9", 7),
    description:
      "An installation that composes an evolving soundscape in real time from the movement of people in a room.",
    overview:
      "Cadence is a spatial audio installation. Depth cameras track visitors; a generative engine maps their motion into evolving harmony, rhythm, and light — turning a gallery into a collaborative instrument nobody has to learn.",
    problem:
      "Interactive art often feels like a gimmick — press a button, hear a beep. The goal was an experience that felt alive and responsive without an obvious control surface.",
    solution:
      "I built a real-time motion-to-music mapping using a rules engine over a generative synthesis graph, with careful smoothing so the space feels responsive but never chaotic — musical, not reactive.",
    process: [
      { phase: "Concept", detail: "Prototyped motion → parameter mappings with dancers." },
      { phase: "Engine", detail: "Built the generative synthesis graph and smoothing layer." },
      { phase: "Spatial", detail: "Calibrated 8-channel audio and depth-camera fusion." },
      { phase: "Install", detail: "Tuned the room live over a week of open rehearsals." },
    ],
    challenges: [
      "Fusing multiple depth cameras into one coherent motion field.",
      "Keeping generated music musical under unpredictable, chaotic input.",
      "Sub-20ms latency from motion to sound to feel truly responsive.",
    ],
    features: [
      "Real-time multi-person motion tracking",
      "Generative harmony that never repeats",
      "8-channel spatial audio spatialization",
      "Reactive lighting choreographed to the score",
    ],
    tech: ["Web Audio", "TypeScript", "Three.js", "WebRTC", "TouchDesigner", "Rust"],
    gallery: [art("#22c55e", "#16a34a", 31), art("#0ea5e9", "#22c55e", 32), art("#84cc16", "#06b6d4", 33)],
    timeline: [
      { label: "R&D prototype", date: "Jun 2024", done: true },
      { label: "Synthesis engine", date: "Aug 2024", done: true },
      { label: "Spatial calibration", date: "Sep 2024", done: true },
      { label: "Public exhibition", date: "Nov 2024", done: true },
    ],
    metrics: [
      { value: "<20ms", label: "motion→sound" },
      { value: "8ch", label: "spatial audio" },
      { value: "12k", label: "visitors" },
    ],
    links: { github: "https://github.com/", demo: "https://example.com/" },
  },
  {
    id: "vault",
    title: "Vault",
    tagline: "Privacy-first payments infrastructure",
    year: "2023",
    role: "Senior Engineer",
    category: "Fintech",
    accent: "#f472b6",
    cover: art("#f43f5e", "#7c3aed", 9),
    description:
      "A payments layer that keeps sensitive data encrypted end-to-end while staying fully queryable and compliant.",
    overview:
      "Vault lets fintechs process payments without ever seeing raw card or identity data. Encryption and tokenization happen at the edge; a policy engine enforces access, and everything remains auditable and PCI-compliant.",
    problem:
      "Handling raw financial data is a liability minefield. Most teams either take on massive compliance scope or ship insecure shortcuts under deadline pressure.",
    solution:
      "I built an edge tokenization gateway with envelope encryption and a policy engine that scopes access per field. Analytics run over tokens, so teams get insight without ever touching plaintext.",
    process: [
      { phase: "Threat model", detail: "Mapped data flows and attack surfaces with security." },
      { phase: "Gateway", detail: "Built the edge tokenization + envelope encryption layer." },
      { phase: "Policy", detail: "Designed per-field access scoping and audit logging." },
      { phase: "Compliance", detail: "Drove the PCI-DSS Level 1 audit to completion." },
    ],
    challenges: [
      "Sub-10ms tokenization overhead on the hot payment path.",
      "Key rotation with zero downtime across live sessions.",
      "Passing a full PCI-DSS Level 1 audit on the first attempt.",
    ],
    features: [
      "Edge tokenization with envelope encryption",
      "Per-field, policy-driven access control",
      "Analytics over encrypted tokens",
      "Immutable, queryable audit trail",
    ],
    tech: ["Go", "TypeScript", "Postgres", "AWS KMS", "Terraform", "gRPC"],
    gallery: [art("#f43f5e", "#e11d48", 41), art("#7c3aed", "#f43f5e", 42), art("#be123c", "#6d28d9", 43)],
    timeline: [
      { label: "Threat modeling", date: "Jan 2023", done: true },
      { label: "Tokenization gateway", date: "Apr 2023", done: true },
      { label: "Policy engine", date: "Jul 2023", done: true },
      { label: "PCI-DSS L1 audit", date: "Nov 2023", done: true },
    ],
    metrics: [
      { value: "9ms", label: "token overhead" },
      { value: "0", label: "plaintext leaks" },
      { value: "L1", label: "PCI-DSS" },
    ],
    links: { github: "https://github.com/", demo: "https://example.com/" },
  },
];

export type Milestone = {
  year: string;
  title: string;
  org: string;
  kind: "education" | "internship" | "hackathon" | "work" | "project";
  detail: string;
};

export const milestones: Milestone[] = [
  {
    year: "2018",
    title: "B.S. Computer Science",
    org: "University of Washington",
    kind: "education",
    detail: "Focused on distributed systems and human–computer interaction. Graduated with honors.",
  },
  {
    year: "2019",
    title: "Software Engineering Intern",
    org: "Figma",
    kind: "internship",
    detail: "Built multiplayer cursor presence and shipped it to production during the summer.",
  },
  {
    year: "2020",
    title: "Grand Prize — TreeHacks",
    org: "Stanford",
    kind: "hackathon",
    detail: "Led a team of four to build a real-time captioning tool for the hard of hearing.",
  },
  {
    year: "2021",
    title: "Software Engineer",
    org: "Stripe",
    kind: "work",
    detail: "Owned latency-critical services on the payments platform serving billions of requests.",
  },
  {
    year: "2023",
    title: "Senior Software Engineer",
    org: "Vercel",
    kind: "work",
    detail: "Led the edge runtime team; drove cold-start times down by 70% across the fleet.",
  },
  {
    year: "2025",
    title: "Creative Technologist & Freelance",
    org: "Independent",
    kind: "project",
    detail: "Building expressive interfaces and platforms at the intersection of engineering and design.",
  },
];

export type Skill = {
  id: string;
  label: string;
  group: "language" | "frontend" | "backend" | "infra" | "creative";
  level: number;
  related: string[];
  projects: string[];
};

export const skills: Skill[] = [
  { id: "ts", label: "TypeScript", group: "language", level: 0.98, related: ["react", "node", "next"], projects: ["helios", "aurora", "cadence"] },
  { id: "rust", label: "Rust", group: "language", level: 0.82, related: ["webgl", "grpc"], projects: ["helios", "cadence"] },
  { id: "go", label: "Go", group: "language", level: 0.85, related: ["grpc", "k8s"], projects: ["vault"] },
  { id: "react", label: "React", group: "frontend", level: 0.97, related: ["ts", "next", "gsap"], projects: ["aurora"] },
  { id: "next", label: "Next.js", group: "frontend", level: 0.93, related: ["react", "ts"], projects: ["aurora"] },
  { id: "webgl", label: "WebGL / Three", group: "frontend", level: 0.88, related: ["rust", "gsap"], projects: ["helios", "cadence"] },
  { id: "gsap", label: "GSAP", group: "creative", level: 0.9, related: ["react", "webgl"], projects: ["cadence", "aurora"] },
  { id: "audio", label: "Web Audio", group: "creative", level: 0.8, related: ["webgl"], projects: ["cadence"] },
  { id: "node", label: "Node.js", group: "backend", level: 0.9, related: ["ts", "grpc"], projects: ["aurora"] },
  { id: "grpc", label: "gRPC", group: "backend", level: 0.84, related: ["go", "rust", "node"], projects: ["helios", "vault"] },
  { id: "postgres", label: "Postgres", group: "backend", level: 0.86, related: ["go"], projects: ["vault"] },
  { id: "k8s", label: "Kubernetes", group: "infra", level: 0.8, related: ["go", "terraform"], projects: ["helios"] },
  { id: "terraform", label: "Terraform", group: "infra", level: 0.78, related: ["k8s"], projects: ["vault"] },
];

export const profile = {
  name: "Aria Voss",
  first: "ARIA",
  last: "VOSS",
  role: "Software Engineer & Creative Technologist",
  location: "Seattle, WA",
  email: "hello@ariavoss.dev",
  summary:
    "I build systems and interfaces where engineering rigor meets design craft — from GPU-accelerated observability platforms to generative art installations.",
  socials: [
    { label: "GitHub", handle: "@ariavoss", url: "https://github.com/" },
    { label: "LinkedIn", handle: "in/ariavoss", url: "https://linkedin.com/" },
    { label: "X / Twitter", handle: "@ariavoss", url: "https://x.com/" },
    { label: "Email", handle: "hello@ariavoss.dev", url: "mailto:hello@ariavoss.dev" },
  ],
};
