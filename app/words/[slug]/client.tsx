"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import { BackButton } from "@/components/ui/back-button";
import { Collaborators } from "@/components/ui/collaborators";
import { formatDate } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";
import { LanguageRunner } from "@/components/language-runner";
import { CodeBlock } from "@/components/markdown/code-block";
import { blogs } from "@/lib/data/words";
import type { Blog, TocItem } from "@/lib/types";

interface Props {
  blog: Blog & { contentHtml: string; headings: TocItem[] };
}

function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            setProgress(Math.min(1, scrollTop / docHeight));
          }
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-border">
      <div
        className="h-full bg-accent transition-[width] duration-100 ease-linear"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}

function TocItem({ item, activeId }: { item: TocItem; activeId: string }) {
  const isActive = activeId === item.id;
  return (
    <li>
      <a
        href={`#${item.id}`}
        className={`block py-1 text-xs leading-snug transition-colors duration-200 ${
          isActive ? "text-accent font-medium" : "text-muted hover:text-secondary"
        }`}
        onClick={(e) => {
          e.preventDefault();
          document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        {item.text}
      </a>
      {item.children && item.children.length > 0 && (
        <ul className="ml-3 border-l border-border pl-3 mt-0.5 space-y-0.5">
          {item.children.map((child) => (
            <li key={child.id}>
              <a
                href={`#${child.id}`}
                className={`block py-0.5 text-[11px] leading-snug transition-colors duration-200 ${
                  activeId === child.id ? "text-accent font-medium" : "text-muted hover:text-secondary"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(child.id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {child.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    const ids: string[] = [];
    (function walk(items: TocItem[]) {
      for (const item of items) {
        ids.push(item.id);
        if (item.children) walk(item.children);
      }
    })(headings);
    if (ids.length === 0) return;

    let ticking = false;
    function update() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const offset = 100;
          let current = ids[0];

          for (const id of ids) {
            const el = document.getElementById(id);
            if (el && el.getBoundingClientRect().top <= offset) {
              current = id;
            }
          }

          const sentinel = document.getElementById("toc-end");
          if (sentinel) {
            const rect = sentinel.getBoundingClientRect();
            if (rect.top <= window.innerHeight + 200) {
              current = ids[ids.length - 1];
            }
          }

          setActiveId(current);
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => window.removeEventListener("scroll", update);
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <h2 className="text-[11px] uppercase tracking-wider text-muted font-medium mb-3">
        On this page
      </h2>
      <ul className="space-y-0.5">
        {headings.map((h) => (
          <TocItem key={h.id} item={h} activeId={activeId} />
        ))}
      </ul>
    </nav>
  );
}

const seriesOrder = [
  "making-a-programming-language",
  "making-a-language-the-lexer",
  "making-a-language-the-parser",
  "making-a-language-the-evaluator",
  "making-a-language-using-spark",
];

function SeriesNav({ slug }: { slug: string }) {
  const idx = seriesOrder.indexOf(slug);
  if (idx === -1) return null;

  const prevSlug = idx > 0 ? seriesOrder[idx - 1] : null;
  const nextSlug = idx < seriesOrder.length - 1 ? seriesOrder[idx + 1] : null;
  const prevBlog = prevSlug ? blogs.find((b) => b.slug === prevSlug) : null;
  const nextBlog = nextSlug ? blogs.find((b) => b.slug === nextSlug) : null;

  return (
    <nav className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center sm:justify-between gap-4">
      <div className="text-center sm:text-left sm:flex-1">
        {prevBlog && (
          <Link
            href={`/words/${prevSlug}`}
            className="group inline-flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors duration-200"
          >
            <ChevronLeftIcon className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <div className="min-w-0">
              <div className="text-[11px] text-muted">Previous</div>
              <div className="truncate">{prevBlog.title}</div>
            </div>
          </Link>
        )}
      </div>
      <div className="text-center sm:text-right sm:flex-1">
        {nextBlog && (
          <Link
            href={`/words/${nextSlug}`}
            className="group inline-flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors duration-200"
          >
            <div className="min-w-0">
              <div className="text-[11px] text-muted">Next</div>
              <div className="truncate">{nextBlog.title}</div>
            </div>
            <ChevronRightIcon className="size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </nav>
  );
}

export function BlogPageClient({ blog }: Props) {
  return (
    <>
      <ProgressBar />
      <main
        className="min-h-screen w-full px-6 py-16 md:py-24 page-enter"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <BackButton href="/" variant="pill" />
          </div>

          <div className="flex gap-12">
            <article className="flex-1 min-w-0 max-w-3xl">
              {blog.hero && (
                <div className="overflow-hidden rounded-lg border border-border mb-8">
                  <Image
                    src={blog.hero.src}
                    alt={blog.hero.alt ?? blog.title}
                    width={1200}
                    height={600}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}

              <header className="mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-primary leading-tight">
                  {blog.title}
                </h1>
                <p className="text-sm text-secondary mt-3 leading-relaxed">
                  {blog.description}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-muted">
                  {blog.date?.start && (
                    <span className="tabular-nums">
                      {formatDate(blog.date.start)}
                      {blog.date.end && <> - updated {formatDate(blog.date.end)}</>}
                    </span>
                  )}
                  {blog.tags && blog.tags.length > 0 && (
                    <span className="flex items-center gap-2">
                      {blog.tags.map((t) => (
                        <Tag key={t} tag={t} />
                      ))}
                    </span>
                  )}
                </div>

                {blog.collaborators && blog.collaborators.length > 0 && (
                  <div className="mt-4">
                    <Collaborators collaborators={blog.collaborators} />
                  </div>
                )}
              </header>

              <CodeBlock>
                <div
                  className="prose-custom flex flex-col gap-2"
                  dangerouslySetInnerHTML={{ __html: blog.contentHtml }}
                />
              </CodeBlock>

              <SeriesNav slug={blog.slug} />

              <div id="toc-end" />

              {blog.slug === "making-a-language-using-spark" && <LanguageRunner />}
            </article>

            {blog.headings.length > 0 && (
              <aside className="hidden lg:block w-56 shrink-0">
                <TableOfContents headings={blog.headings} />
              </aside>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
