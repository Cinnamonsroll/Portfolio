import { toDateString, type RawProject } from "@/lib/types";

const project: RawProject = {
  title: "Trigr",
  description: "A desktop text expander that turns your shortcuts into text",
  synopsis: "Desktop text expander with Trill scripting",
  tags: ["tauri", "desktop", "rust", "react"],
  hero: { src: "/projects/trigr/hero.svg", alt: "Trigr" },
  images: [
    { src: "/projects/trigr/website.png", alt: "Trigr website" },
    { src: "/projects/trigr/app.png", alt: "Trigr app interface" },
  ],
  date: { start: toDateString("2026-05-06") },
  links: [
    { name: "Website", url: "https://trigr.pancake.wtf" },
    { name: "GitHub", url: "https://github.com/TrigrApp" },
  ],
  collaborators: [
    { name: "null8626", github: "https://github.com/null8626", role: "Github contributor" },
  ],
  status: "active",
};

export default project;
