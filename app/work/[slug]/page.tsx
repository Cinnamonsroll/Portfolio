import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "highlight.js/styles/github-dark.css";
import { projects } from "@/lib/data/projects";
import { getMarkdownContent } from "@/lib/data/content";
import { renderMarkdown } from "@/lib/markdown";
import { ProjectPageClient } from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const title = `${project.title} — Juliette`;
  const description = project.description;
  const image = project.hero?.src;
  const url = `https://pancake.wtf/work/${slug}`;

  return {
    title,
    description,
    icons: { icon: project.hero?.src ?? "/favicon.svg" },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: image ? [{ url: image, width: 1200, height: 600 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
  };
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function renderContentToHtml(
  content: string,
  images: { src: string; alt?: string }[],
): string {
  return renderMarkdown(content, images, "my-6", false, "img-hover w-full rounded-lg border border-border object-cover cursor-pointer");
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const content = getMarkdownContent("projects", slug);
  const contentHtml = renderContentToHtml(content, project.images ?? []);

  return <ProjectPageClient project={{ ...project, contentHtml }} />;
}
