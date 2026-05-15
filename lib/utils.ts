export const STICKER_ICON = "/crafts/stickers/icon.svg";

export const STICKER_OUTLINE =
  "drop-shadow(-2px 0 0 white) drop-shadow(2px 0 0 white) drop-shadow(0 -2px 0 white) drop-shadow(0 2px 0 white)";

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr + (dateStr.length <= 7 ? "-01" : ""));
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + (dateStr.length <= 7 ? "-01" : ""));
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
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
