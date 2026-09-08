import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "highlight.js/styles/github-dark.css";
import { blogs } from "@/lib/data/words";
import { getMarkdownContent } from "@/lib/data/content";
import { renderMarkdown, headingId } from "@/lib/markdown";
import type { TocItem } from "@/lib/types";
import { BlogPageClient } from "./client";
import { JsonLd } from "@/components/seo/json-ld";
import { NAME } from "@/lib/constants";

const SITE_URL = "https://pancake.wtf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return {};

  const title = blog.title;
  const description = blog.description;
  const url = `${SITE_URL}/words/${slug}`;
  const publishedTime = blog.date?.start
    ? `${blog.date.start}T00:00:00.000Z`
    : undefined;
  const modifiedTime = blog.date?.end
    ? `${blog.date.end}T00:00:00.000Z`
    : publishedTime;

  return {
    title,
    description,
    alternates: {
      canonical: `/words/${slug}`,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: NAME,
      locale: "en_US",
      type: "article",
      publishedTime,
      modifiedTime,
      authors: [NAME],
      tags: blog.tags,
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
  const url = `${SITE_URL}/words/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: blog.title,
          description: blog.description,
          url,
          image: blog.hero?.src ? `${SITE_URL}${blog.hero.src}` : undefined,
          datePublished: blog.date?.start
            ? `${blog.date.start}T00:00:00.000Z`
            : undefined,
          dateModified: blog.date?.end
            ? `${blog.date.end}T00:00:00.000Z`
            : undefined,
          author: {
            "@type": "Person",
            name: NAME,
            url: SITE_URL,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": url,
          },
          inLanguage: "en-US",
        }}
      />
      <BlogPageClient blog={{ ...blog, contentHtml, headings }} />
    </>
  );
}
