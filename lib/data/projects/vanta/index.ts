import { toDateString, type RawProject } from "@/lib/types";

const project: RawProject = {
  title: "Vanta",
  description: "Realtime event analytics built for developers",
  synopsis: "See everything happening in your applications",
  tags: ["react", "typescript", "analytics"],
  hero: { src: "/projects/vanta/hero.png", alt: "Vanta" },
  images: [
    { src: "/projects/vanta/home.png", alt: "Vanta home page" },
    { src: "/projects/vanta/dashboard.png", alt: "Vanta dashboard" },
  ],
  date: { start: toDateString("2026-09-08") },
  links: [
    { name: "Website", url: "https://vanta.pancake.wtf" },
  ],
  status: "active",
};

export default project;
