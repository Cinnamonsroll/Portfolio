import type { Craft } from "@/lib/types";
import { slugify } from "@/lib/utils";
import stickers from "./stickers/index";

const raw = [stickers];

export const crafts: Craft[] = raw.map((c) => ({
  ...c,
  slug: slugify(c.title),
}));
