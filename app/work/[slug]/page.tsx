import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import { projects } from "@/lib/data/projects";
import { getProjectContent } from "@/lib/data/projects/content";
import { ProjectPageClient } from "./client";

marked.use(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

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
  let html = content;

  for (let i = 0; i < images.length; i++) {
    const re = new RegExp(`\\{image:${i + 1}\\}`, "g");
    const img = images[i];
    html = html.replace(
      re,
      `<figure class="my-6"><img src="${img.src}" alt="${img.alt ?? ""}" class="img-hover w-full rounded-lg border border-border object-cover cursor-pointer" />${img.alt ? `<figcaption class="text-xs text-center italic text-muted mt-1.5">${img.alt}</figcaption>` : ""}</figure>`,
    );
  }

  return wrapCodeBlocks(marked.parse(html, { async: false }) as string);
}

function wrapCodeBlocks(html: string): string {
  return html.replace(
    /<pre\b[^>]*>([\s\S]*?)<\/pre>/g,
    (match) =>
      `<div class="code-block">${match}<button class="copy-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="12" height="12"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" /></svg></button></div>`,
  );
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  const content = getProjectContent(slug);
  const contentHtml = renderContentToHtml(content, project.images ?? []);

  return <ProjectPageClient project={{ ...project, contentHtml }} />;
}
