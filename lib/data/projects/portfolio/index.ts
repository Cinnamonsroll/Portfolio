import { toDateString, type RawProject } from "@/lib/types";

const project: RawProject = {
  title: "Portfolio",
  description: "My personal portfolio website built with Next.js",
  synopsis: "Personal portfolio built with Next.js",
  tags: ["web", "portfolio"],
  hero: { src: "/projects/portfolio/hero.svg", alt: "Portfolio" },
  images: [
    { src: "/projects/portfolio/website.png", alt: "Portfolio homepage" },
    { src: "/projects/portfolio/website_trigr.png", alt: "Project page" },
    { src: "/projects/portfolio/website_mobile.png", alt: "Mobile view" },
  ],
  date: { start: toDateString("2026-05-15") },
  status: "active",
  
};

export default project;
