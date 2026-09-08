import type { Project } from "@/lib/types";
import { slugify } from "@/lib/utils";
import portfolio from "./portfolio/index";
import numeral from "./numeral/index";
import trigr from "./trigr/index";
import spectra from "./spectra/index";
import sve from "./sve/index";
import vanta from "./vanta/index";
import kivo from "./kivo/index";

const raw = [portfolio, numeral, trigr, spectra, sve, vanta, kivo];

export const projects: Project[] = raw.map((p) => ({
  ...p,
  slug: slugify(p.title),
}));
