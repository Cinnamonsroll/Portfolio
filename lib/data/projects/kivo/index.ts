import { toDateString, type RawProject } from "@/lib/types";

const project: RawProject = {
  title: "Kivo",
  description: "A bookmarking tool that handles every type of data, not just links",
  synopsis: "Bookmark it once, put it anywhere",
  tags: ["react", "typescript"],
  hero: { src: "/projects/kivo/hero.svg", alt: "Kivo" },
  images: [
    { src: "/projects/kivo/home.png", alt: "Kivo home page" },
    { src: "/projects/kivo/dashboard.png", alt: "Kivo dashboard" },
  ],
  date: { start: toDateString("2026-09-08") },
  links: [
    { name: "Website", url: "https://kivo.pancake.wtf" },
  ],
  status: "active",
};

export default project;
