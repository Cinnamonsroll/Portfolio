import { toDateString, type RawProject } from "@/lib/types";

const project: RawProject = {
  title: "sve",
  description: "A concept project where you could code and host simple HTML/CSS sites on your own sve.one subdomain",
  synopsis: "Free, simple, one-page sites for anything.",
  tags: ["express", "ejs", "bootstrap", "node", "mongodb"],
  hero: { src: "/projects/sve/hero.webp", alt: "sve" },
  images: [
    { src: "/projects/sve/home.png", alt: "sve home page" },
    { src: "/projects/sve/page.png", alt: "sve page editor" },
    { src: "/projects/sve/manage.png", alt: "sve site management" },
    { src: "/projects/sve/settings.png", alt: "sve settings" },
  ],
  date: { start: toDateString("2022-09-26") },
  collaborators: [
    { name: "DanPlayz0", github: "https://github.com/DanPlayz0", role: "co-creator" },
    { name: "AshMW2724", github: "https://github.com/AshMW2724", role: "co-creator" },
  ],
  links: [
    { name: "Website", url: "https://sve.one" },
    { name: "GitHub", url: "https://github.com/sveone/sveone" },
  ],
  status: "archived",
};

export default project;
