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
    id: "bear-witness",
    title: "Bear Witness",
    tagline: "Bringing awareness to underreported humanitarian crises.",
    year: "2025",
    role: "Design & Development",
    category: "Humanitarian Tech / Data Visualisation",
    accent: "#6ee7ff",
    cover: art("#0ea5e9", "#6366f1", 3),
    description:
      "An interactive platform that brings awareness to underreported humanitarian crises by transforming humanitarian data into accessible visual experiences.",
    overview:
      "Bear Witness is an interactive platform that brings attention to underreported humanitarian crises. It transforms humanitarian data into accessible visual experiences — a live dashboard where anyone can explore events, regions, and trends through interactive maps and data visualisations.",
    problem:
      "Many humanitarian emergencies receive limited attention despite affecting millions of people. Important information is often difficult for ordinary users to discover and understand.",
    solution:
      "A live dashboard that visualises humanitarian crises around the world, allowing users to explore events, regions, and trends through interactive maps and data visualisations.",
    process: [
      { phase: "Research", detail: "Studied how humanitarian data is published (e.g. ReliefWeb) and where awareness gaps exist." },
      { phase: "Design", detail: "Shaped the experience around exploration — maps first, with details surfaced on demand." },
      { phase: "Build", detail: "Built the interactive world map and charts, wiring them to live humanitarian data." },
      { phase: "Refine", detail: "Added crisis filtering and polished the data-driven views for clarity." },
    ],
    challenges: [
      "Making dense humanitarian data understandable for non-expert users.",
      "Integrating and normalising live data from the ReliefWeb API.",
      "Designing map and chart interactions that stay responsive across many events.",
    ],
    features: [
      "Interactive world map",
      "Crisis location visualisation",
      "Humanitarian event exploration",
      "Data-driven dashboard",
      "Crisis filtering",
      "Real-time data integration",
    ],
    tech: ["JavaScript", "HTML", "CSS", "Leaflet.js", "Chart.js", "ReliefWeb API"],
    gallery: [art("#0ea5e9", "#22d3ee", 11), art("#6366f1", "#0ea5e9", 12), art("#0891b2", "#4338ca", 13)],
    timeline: [
      { label: "Research & data sources", date: "Mar 2025", done: true },
      { label: "Map & dashboard build", date: "Mar 2025", done: true },
      { label: "Filtering & polish", date: "Apr 2025", done: true },
      { label: "Launch", date: "Apr 2025", done: true },
    ],
    metrics: [
      { value: "Global", label: "crisis coverage" },
      { value: "Live", label: "ReliefWeb data" },
      { value: "Interactive", label: "maps & charts" },
    ],
    links: { github: "https://github.com/tanvirhossainparvin" },
  },
  {
    id: "medifi",
    title: "Medifi",
    tagline: "AI that turns NHS letters into plain English.",
    year: "2025",
    role: "Full-Stack & AI",
    category: "AI Healthcare / Hackathon",
    accent: "#a78bfa",
    cover: art("#a78bfa", "#f472b6", 5),
    description:
      "An AI-powered application that helps NHS patients understand complicated medical letters by converting them into clear, simple explanations.",
    overview:
      "Medifi is an AI-powered app that helps NHS patients understand complicated medical letters. Built during the VibeHack London AI Hackathon, it converts confusing correspondence into clear explanations, plain-English summaries, and actionable next steps.",
    problem:
      "Healthcare letters often contain confusing medical terminology, making it difficult for patients to understand what actions they need to take.",
    solution:
      "A tool that uses AI to analyse NHS letters and provide understandable explanations, summaries, and actionable next steps.",
    process: [
      { phase: "Ideation", detail: "Framed the problem with the team — patients struggling to understand NHS letters." },
      { phase: "Build", detail: "Built the React front end and Firebase backend for uploads and results." },
      { phase: "AI integration", detail: "Connected AI APIs to analyse letters and produce plain-English output." },
      { phase: "Demo", detail: "Pitched the working prototype at VibeHack London." },
    ],
    challenges: [
      "Turning jargon-heavy medical text into clear, trustworthy explanations.",
      "Reading text from uploaded letter images reliably.",
      "Building a complete, working full-stack tool within hackathon time limits.",
    ],
    features: [
      "Upload NHS letters through images",
      "AI-powered explanation",
      "Plain English summaries",
      "Appointment date extraction",
      "Action plans",
      "Important reminders",
    ],
    tech: ["AI APIs", "React", "JavaScript", "Firebase", "Full-Stack Web Dev"],
    gallery: [art("#a78bfa", "#8b5cf6", 21), art("#f472b6", "#a78bfa", 22), art("#7c3aed", "#ec4899", 23)],
    timeline: [
      { label: "Ideation & planning", date: "Day 1", done: true },
      { label: "Full-stack build", date: "Day 1", done: true },
      { label: "AI integration", date: "Day 2", done: true },
      { label: "Final demo", date: "Demo day", done: true },
    ],
    metrics: [
      { value: "AI", label: "powered explanations" },
      { value: "NHS", label: "letters simplified" },
      { value: "Team", label: "hackathon build" },
    ],
    links: { github: "https://github.com/tanvirhossainparvin" },
  },
  {
    id: "now-what",
    title: "Now What?",
    tagline: "Visualising climate-health risk across London.",
    year: "2025",
    role: "Data & Front-End",
    category: "Climate Tech / AI Dashboard",
    accent: "#c6ff5e",
    cover: art("#22c55e", "#0ea5e9", 7),
    description:
      "An interactive climate and health-risk dashboard that visualises vulnerability across London boroughs.",
    overview:
      "Now What? is an interactive climate and health-risk dashboard that visualises vulnerability across London boroughs. Built during the Health in Climate AI Hackathon, it lets users explore where climate-related health risks are highest and compare communities.",
    problem:
      "Climate risks do not affect all communities equally. Understanding where risks are highest requires combining environmental and social data.",
    solution:
      "A visual dashboard that allows users to explore climate-related health risks and compare vulnerability across London.",
    process: [
      { phase: "Research", detail: "Explored how climate risk and health vulnerability overlap across London." },
      { phase: "Data", detail: "Combined environmental and social datasets into map-ready layers." },
      { phase: "Build", detail: "Built the interactive London map with risk and equity layers." },
      { phase: "Demo", detail: "Presented the dashboard at the Health in Climate AI Hackathon." },
    ],
    challenges: [
      "Combining environmental and social data into a fair vulnerability picture.",
      "Communicating equity and severity clearly on a single map.",
      "Delivering an interactive dashboard within a hackathon timeframe.",
    ],
    features: [
      "Interactive London map",
      "Climate risk layers",
      "Health vulnerability indicators",
      "Equity severity mapping",
      "Data exploration tools",
    ],
    tech: ["JavaScript", "Mapping Technologies", "Data Visualisation", "AI-Assisted Development"],
    gallery: [art("#22c55e", "#16a34a", 31), art("#0ea5e9", "#22c55e", 32), art("#84cc16", "#06b6d4", 33)],
    timeline: [
      { label: "Research & framing", date: "Day 1", done: true },
      { label: "Data & layers", date: "Day 1", done: true },
      { label: "Map dashboard build", date: "Day 2", done: true },
      { label: "Final demo", date: "Demo day", done: true },
    ],
    metrics: [
      { value: "London", label: "borough-level risk" },
      { value: "AI", label: "assisted build" },
      { value: "Team", label: "hackathon build" },
    ],
    links: { github: "https://github.com/tanvirhossainparvin" },
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
    year: "2019",
    title: "Team Member",
    org: "Itsu",
    kind: "work",
    detail: "Fast-paced service role built teamwork, reliability, and clear communication under pressure.",
  },
  {
    year: "2020",
    title: "Customer Assistant",
    org: "Marks & Spencer",
    kind: "work",
    detail: "Customer-facing retail sharpened problem solving, responsibility, and attention to detail.",
  },
  {
    year: "2021",
    title: "BSc (Hons) Computer Science",
    org: "Goldsmiths, University of London",
    kind: "education",
    detail:
      "Modules spanning algorithms & data structures, OOP, software design, data programming for AI, information security, web development, computer architecture, and computer graphics.",
  },
  {
    year: "2022",
    title: "Tutor",
    org: "MTC Tuition Centre",
    kind: "work",
    detail: "Explaining complex ideas simply and patiently — communication, mentoring, and breaking down problems.",
  },
  {
    year: "2023",
    title: "Door Supervisor",
    org: "Achilleus Security",
    kind: "work",
    detail: "Safety, conflict resolution, and calm decision-making in high-pressure environments.",
  },
  {
    year: "2024",
    title: "Software Engineering Intern",
    org: "DigitalAsset.ai",
    kind: "internship",
    detail: "Worked across backend development, Firebase integration, and frontend design to build real software features.",
  },
  {
    year: "2025",
    title: "VibeHack London AI Hackathon",
    org: "Project: Medifi",
    kind: "hackathon",
    detail: "Built Medifi — an AI tool that turns confusing NHS letters into plain-English explanations — with a team, under time pressure.",
  },
  {
    year: "2025",
    title: "Health in Climate AI Hackathon",
    org: "Project: Now What?",
    kind: "hackathon",
    detail: "Built Now What? — a dashboard mapping climate-health risk and equity across London boroughs.",
  },
  {
    year: "2025",
    title: "Bear Witness",
    org: "Humanitarian Data Platform",
    kind: "project",
    detail: "Designed and built an interactive platform that turns humanitarian data into accessible visual experiences.",
  },
];

export type Skill = {
  id: string;
  label: string;
  group: "languages" | "frontend" | "backend" | "ai" | "tools";
  level: number;
  related: string[];
  projects: string[];
};

export const skills: Skill[] = [
  // Languages
  { id: "java", label: "Java", group: "languages", level: 0.85, related: ["oop", "algorithms"], projects: [] },
  { id: "js", label: "JavaScript", group: "languages", level: 0.95, related: ["react", "node", "htmlcss"], projects: ["bear-witness", "medifi", "now-what"] },
  { id: "python", label: "Python", group: "languages", level: 0.88, related: ["pydata", "ml"], projects: [] },
  { id: "sql", label: "SQL", group: "languages", level: 0.78, related: ["node"], projects: [] },

  // Frontend
  { id: "react", label: "React", group: "frontend", level: 0.92, related: ["js", "next", "tailwind"], projects: ["medifi"] },
  { id: "next", label: "Next.js", group: "frontend", level: 0.85, related: ["react", "tailwind", "vercel"], projects: [] },
  { id: "tailwind", label: "Tailwind CSS", group: "frontend", level: 0.88, related: ["react", "htmlcss"], projects: [] },
  { id: "htmlcss", label: "HTML / CSS", group: "frontend", level: 0.95, related: ["js", "tailwind"], projects: ["bear-witness"] },

  // Backend
  { id: "node", label: "Node.js", group: "backend", level: 0.82, related: ["express", "js", "rest"], projects: [] },
  { id: "express", label: "Express.js", group: "backend", level: 0.78, related: ["node", "rest"], projects: [] },
  { id: "firebase", label: "Firebase", group: "backend", level: 0.83, related: ["react", "rest"], projects: ["medifi"] },
  { id: "rest", label: "REST APIs", group: "backend", level: 0.85, related: ["node", "firebase", "dataviz"], projects: ["bear-witness", "medifi"] },

  // AI & Data
  { id: "dataviz", label: "Data Visualisation", group: "ai", level: 0.87, related: ["js", "pydata"], projects: ["bear-witness", "now-what"] },
  { id: "ml", label: "Machine Learning", group: "ai", level: 0.7, related: ["python", "pydata"], projects: ["medifi"] },
  { id: "pydata", label: "Python Data Analysis", group: "ai", level: 0.78, related: ["python", "dataviz"], projects: ["now-what"] },

  // Tools & CS
  { id: "git", label: "Git / GitHub", group: "tools", level: 0.9, related: ["vercel", "netlify"], projects: ["bear-witness", "medifi", "now-what"] },
  { id: "vercel", label: "Vercel", group: "tools", level: 0.8, related: ["next", "git"], projects: [] },
  { id: "netlify", label: "Netlify", group: "tools", level: 0.8, related: ["git"], projects: [] },
  { id: "oop", label: "OOP", group: "tools", level: 0.88, related: ["java", "algorithms"], projects: [] },
  { id: "algorithms", label: "Algorithms", group: "tools", level: 0.85, related: ["java", "oop"], projects: [] },
];

export const profile = {
  name: "Tanvir Hossain Parvin",
  displayName: "Tanvir",
  first: "TANVIR",
  last: "TANVIR",
  role: "Computer Science Graduate / Software Engineer",
  location: "London, United Kingdom",
  // NOTE: update the email + social URLs below with your real details.
  email: "tanvirhossainparvin@gmail.com",
  summary:
    "A software engineer who enjoys building meaningful technology at the intersection of software engineering, AI, data visualisation, cybersecurity, and emerging futuristic tech.",
  about: [
    "I am a Computer Science graduate based in London who enjoys building software that solves real-world problems. My work focuses on creating useful, intuitive, and technically interesting applications, from AI-powered healthcare tools to humanitarian data platforms.",
    "I enjoy exploring the future of technology, including artificial intelligence, robotics, cybersecurity, biotechnology, and human-computer interaction. I like projects where engineering can be combined with creativity and real-world impact.",
  ],
  socials: [
    { label: "GitHub", handle: "@tanvirhossainparvin", url: "https://github.com/tanvirhossainparvin" },
    { label: "LinkedIn", handle: "in/tanvir-hossain-parvin", url: "https://www.linkedin.com/in/tanvir-hossain-parvin" },
    { label: "Email", handle: "tanvirhossainparvin@gmail.com", url: "mailto:tanvirhossainparvin@gmail.com" },
  ],
};
