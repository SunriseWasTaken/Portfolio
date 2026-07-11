import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tanvir Hossain Parvin — Software Engineer",
  description:
    "The portfolio of Tanvir Hossain Parvin — a Computer Science graduate and software engineer in London, building meaningful technology across AI, data visualisation, and the web.",
  keywords: [
    "software engineer",
    "computer science graduate",
    "London",
    "portfolio",
    "frontend",
    "AI",
    "data visualisation",
    "React",
    "Next.js",
  ],
  authors: [{ name: "Tanvir Hossain Parvin" }],
  openGraph: {
    title: "Tanvir Hossain Parvin — Software Engineer",
    description:
      "An interactive portfolio of software, AI, and data-visualisation work by a Computer Science graduate in London.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
