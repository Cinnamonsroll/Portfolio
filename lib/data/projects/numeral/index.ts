import { toDateString, type RawProject } from "@/lib/types";

const project: RawProject = {
  title: "Numeral",
  description:
    "A daily number guessing game, guess the secret 5-digit code in 6 tries. Built in one evening because Numble kept getting worse updates.",
  synopsis: "Remake of Numble, built in a few hours",
  tags: ["web", "game", "nextjs"],
  hero: { src: "/projects/numeral/hero.svg", alt: "Numeral" },
  images: [{ src: "/projects/numeral/website.png", alt: "Numeral website" }],
  date: { start: toDateString("2026-04-30") },
  links: [
    { name: "Website", url: "https://numeral.pancake.wtf" },
    { name: "GitHub", url: "https://github.com/Cinnamonsroll/Numeral" },
  ],
  status: "active",
};

export default project;
