import type { MetadataRoute } from "next";
import { projects } from "@/lib/data/projects";
import { blogs } from "@/lib/data/words";
import { crafts } from "@/lib/data/crafts";
import { LAST_UPDATED } from "@/lib/constants";

const SITE_URL = "https://pancake.wtf";

function toDate(value?: string): string {
  return value ?? LAST_UPDATED.toISOString().split("T")[0];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const sections: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: toDate(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: toDate(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/words`, lastModified: toDate(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/crafts`, lastModified: toDate(), changeFrequency: "monthly", priority: 0.6 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${SITE_URL}/work/${p.slug}`,
    lastModified: toDate(p.date?.start),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${SITE_URL}/words/${b.slug}`,
    lastModified: toDate(b.date?.end ?? b.date?.start),
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const craftPages: MetadataRoute.Sitemap = crafts.map((c) => ({
    url: `${SITE_URL}/crafts/${c.slug}`,
    lastModified: toDate(c.date?.start),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...sections, ...projectPages, ...blogPages, ...craftPages];
}