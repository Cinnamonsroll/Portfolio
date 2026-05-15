import { toDateString, type RawCraft } from "@/lib/types";

const craft: RawCraft = {
  title: "Stickers",
  description: "Drag emoji stickers onto a notebook, rotate them, and then poof if you miss",
  icon: { src: "/crafts/stickers/icon.svg", alt: "Stickers" },
  date: { start: toDateString("2026-05-15") },
  tags: ["css", "html", "interactive"],
};

export default craft;
