import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "highlight.js/styles/github-dark.css";
import { projects } from "@/lib/data/projects";
import { getMarkdownContent } from "@/lib/data/content";
import { renderMarkdown } from "@/lib/markdown";
import { ProjectPageClient } from "./client";
import { JsonLd } from "@/components/seo/json-ld";
import { NAME } from "@/lib/constants";

const SITE_URL = "https://pancake.wtf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};

  const title = project.title;
  const description = project.synopsis ?? project.description;
  const url = `${SITE_URL}/work/${slug}`;
  const publishedTime = project.date?.start
    ? `${project.date.start}T00:00:00.000Z`
    : undefined;

  return {
    title,
    description,
    icons: { icon: project.hero?.src ?? "/favicon.svg" },
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: NAME,
      locale: "en_US",
      type: "article",
      publishedTime,
      tags: project.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@Cinnamo44817432",
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
  const url = `${SITE_URL}/work/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: project.title,
          url,
          description: project.synopsis ?? project.description,
          about: {
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            url,
            image: project.hero?.src ? `${SITE_URL}${project.hero.src}` : undefined,
            creator: {
              "@type": "Person",
              name: NAME,
              url: SITE_URL,
            },
          },
          inLanguage: "en-US",
        }}
      />
      <ProjectPageClient project={{ ...project, contentHtml }} />
    </>
  );
}