import { BIRTHDAY } from "./constants";

export const STICKER_ICON = "/crafts/stickers/icon.svg";

export const STICKER_OUTLINE =
  "drop-shadow(-2px 0 0 white) drop-shadow(2px 0 0 white) drop-shadow(0 -2px 0 white) drop-shadow(0 2px 0 white)";

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(dateStr: string, short?: boolean): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = dateStr.length <= 7 ? new Date(y, m - 1) : new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    ...(short ? {} : { day: "numeric" }),
  });
}

export function byDate(
  a: { date?: { start?: string; end?: string } },
  b: { date?: { start?: string; end?: string } },
): number {
  const aDate = a.date?.end ?? a.date?.start ?? "";
  const bDate = b.date?.end ?? b.date?.start ?? "";
  return bDate.localeCompare(aDate);
}

export function getAge(): number {
  const today = new Date();
  let age = today.getFullYear() - BIRTHDAY.getFullYear();
  const m = today.getMonth() - BIRTHDAY.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < BIRTHDAY.getDate())) {
    age--;
  }
  return age;
}