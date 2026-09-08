import { toDateString, type RawProject } from "@/lib/types";

const project: RawProject = {
  title: "Spectra",
  description: "Windows colour picker, real-time picking, multiple formats, harmonies, and a global shortcut",
  synopsis: "Windows colour picker built with Tauri",
  tags: ["tauri", "desktop", "rust", "typescript"],
  hero: { src: "/projects/spectra/hero.svg", alt: "Spectra" },
  images: [
    { src: "/projects/spectra/app.png", alt: "Spectra app interface" },
  ],
  date: { start: toDateString("2025-12-30") },
  links: [
    { name: "GitHub", url: "https://github.com/Cinnamonsroll/Spectra" },
  ],
  status: "active",
};

export default project;
