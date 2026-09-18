import { SITE_URL } from "@/lib/constants";
import { projects } from "@/lib/data/projects";
import { crafts } from "@/lib/data/crafts";
import { blogs } from "@/lib/data/words";
import type { DiscordEmbedContent } from "./build";

const ACCENT_COLOR = "#e8c44a";
const HOMEPAGE = "https://pancake.wtf";

function absolute(src: string): string {
  if (/^https?:\/\//.test(src)) return src;
  return `${SITE_URL}${src}`;
}

const homeContent: DiscordEmbedContent = {
  accentColor: ACCENT_COLOR,
  title: "Juliette",
  subtitle: "Developer, musician, and aspiring French teacher.",
  image: { url: `${HOMEPAGE}/juliette.png`, description: "Juliette" },
  texts: [
    "I build things with TypeScript and React, learn French, and teach along the way.",
  ],
  buttons: [{ label: "pancake.wtf", url: HOMEPAGE, style: 5 }],
};

const craftsContent: DiscordEmbedContent = {
  accentColor: ACCENT_COLOR,
  title: "Crafts",
  subtitle: "Small things made for fun",
  texts: ["A playground of little ideas, experiments, and interactive toys."],
  buttons: [{ label: "Browse crafts", url: `${HOMEPAGE}/crafts`, style: 5 }],
};

const workContent: DiscordEmbedContent = {
  accentColor: ACCENT_COLOR,
  title: "Work",
  subtitle: "Projects I've built",
  texts: ["Apps, tools, and experiments with TypeScript, React, and more."],
  buttons: [{ label: "View work", url: `${HOMEPAGE}/work`, style: 5 }],
};

const wordsContent: DiscordEmbedContent = {
  accentColor: ACCENT_COLOR,
  title: "Words",
  subtitle: "Thoughts on code",
  texts: ["Writing about building things, one small language at a time."],
  buttons: [{ label: "Read words", url: `${HOMEPAGE}/words`, style: 5 }],
};

const notFoundContent: DiscordEmbedContent = {
  accentColor: ACCENT_COLOR,
  title: "Page not found",
  subtitle: "The page you're looking for doesn't exist or may have moved.",
  buttons: [{ label: "Back to pancake.wtf", url: HOMEPAGE, style: 5 }],
};

function projectContent(
  project: (typeof projects)[number],
): DiscordEmbedContent {
  return {
    accentColor: ACCENT_COLOR,
    title: project.title,
    subtitle: project.synopsis ?? project.description,
    image: project.hero
      ? {
          url: absolute(project.hero.src),
          description: project.hero.alt ?? project.title,
        }
      : undefined,
    texts: [project.description],
    buttons: project.links?.map((link) => ({
      label: link.name,
      url: link.url,
      style: 5,
    })),
  };
}

function craftContent(craft: (typeof crafts)[number]): DiscordEmbedContent {
  return {
    accentColor: ACCENT_COLOR,
    title: craft.title,
    subtitle: craft.description,
    image: craft.icon
      ? {
          url: absolute(craft.icon.src),
          description: craft.icon.alt ?? craft.title,
        }
      : undefined,
    texts: [craft.description],
    buttons: craft.links?.map((link) => ({
      label: link.name,
      url: link.url,
      style: 5,
    })),
  };
}

function blogContent(blog: (typeof blogs)[number]): DiscordEmbedContent {
  return {
    accentColor: ACCENT_COLOR,
    title: blog.title,
    subtitle: blog.description,
    image: blog.hero
      ? {
          url: absolute(blog.hero.src),
          description: blog.hero.alt ?? blog.title,
        }
      : undefined,
    texts: [blog.description],
  };
}

export function getEmbed(path: string[]): DiscordEmbedContent | null {
  const segments = path.map((segment) => segment.replace(/\.json$/i, ""));

  if (
    segments.length === 0 ||
    (segments.length === 1 && segments[0] === "page")
  ) {
    return homeContent;
  }
  if (segments.length === 1 && segments[0] === "not-found") {
    return notFoundContent;
  }
  if (segments.length === 1 && segments[0] === "crafts") {
    return craftsContent;
  }
  if (segments.length === 1 && segments[0] === "work") {
    return workContent;
  }
  if (segments.length === 1 && segments[0] === "words") {
    return wordsContent;
  }
  if (segments.length === 2 && segments[0] === "crafts") {
    const craft = crafts.find((c) => c.slug === segments[1]);
    return craft ? craftContent(craft) : null;
  }
  if (segments.length === 2 && segments[0] === "work") {
    const project = projects.find((p) => p.slug === segments[1]);
    return project ? projectContent(project) : null;
  }
  if (segments.length === 2 && segments[0] === "words") {
    const blog = blogs.find((b) => b.slug === segments[1]);
    return blog ? blogContent(blog) : null;
  }

  return null;
}
