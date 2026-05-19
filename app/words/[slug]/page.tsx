import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "highlight.js/styles/github-dark.css";
import { blogs } from "@/lib/data/words";
import { getMarkdownContent } from "@/lib/data/content";
import { renderMarkdown, headingId } from "@/lib/markdown";
import type { TocItem } from "@/lib/types";
import { BlogPageClient } from "./client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return {};

  const title = `${blog.title} — Words`;
  const description = blog.description;
  const image = blog.hero?.src;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
  return blogs.map((b) => ({ slug: b.slug }));
}

function extractHeadingsFromMd(markdown: string): TocItem[] {
  const lines = markdown.split("\n");
  const headings: TocItem[] = [];
  const stack: TocItem[] = [];
  let inCode = false;

  for (const line of lines) {
    if (/^```/.test(line.trim())) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].trim();
    const id = headingId(text);
    const item: TocItem = { id, text, level };

    if (level === 2) {
      headings.push(item);
      stack.length = 0;
      stack.push(item);
    } else if (level === 3 && stack.length > 0) {
      if (!stack[0].children) stack[0].children = [];
      stack[0].children.push(item);
    }
  }

  return headings;
}

function renderBlogContent(
  content: string,
  images: { src: string; alt?: string }[],
): string {
  return renderMarkdown(content, images, "my-8", true);
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) notFound();

  const content = getMarkdownContent("words", slug);
  const contentHtml = renderBlogContent(content, blog.images ?? []);
  const headings = extractHeadingsFromMd(content);

  return <BlogPageClient blog={{ ...blog, contentHtml, headings }} />;
}
