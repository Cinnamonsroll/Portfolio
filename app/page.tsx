"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/sections/hero";
import { GridSection } from "@/components/sections/grid-section";
import { LAST_UPDATED } from "@/lib/constants";
import { and, filter, timeRange, Vanta } from "@vanta-dev/node";

export default function Home() {
  const [focusSlug, setFocusSlug] = useState<string | null>(null);
  const [pageViews, setPageViews] = useState<number | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_VANTA_API_KEY;

  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_VANTA_API_KEY is not configured");
  }
  const vanta = new Vanta({
    apiKey,
  });

  useEffect(() => {
    if (!vanta) return;

    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    vanta;
    vanta
      .count({
        filters: and(
          filter("type", "equals", "$measure"),
          filter("name", "equals", "page_view"),
        ),
        time: timeRange(yesterday.toISOString(), now.toISOString()),
      })
      .then(({ count }) => {
        setPageViews(count);
      })
      .catch(() => {
        setPageViews(null);
      });
  }, [vanta]);

  return (
    <div className="min-h-screen flex flex-col">
      {focusSlug && (
        <div className="fixed inset-0 z-30 bg-bg-primary/20 backdrop-blur-sm pointer-events-none" />
      )}

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-16">
        <h1 className="sr-only">Juliette</h1>
        <Hero dimmed={focusSlug !== null} />
        <GridSection focusSlug={focusSlug} setFocusSlug={setFocusSlug} />
      </main>

      <footer className="pb-6">
        <small className="text-[11px] text-muted flex items-center justify-center gap-2">
          <span>
            last updated{" "}
            {LAST_UPDATED.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>

          <span aria-hidden="true">·</span>

          <span>
            {pageViews === null ? "..." : pageViews.toLocaleString()} website
            views within the last day
          </span>
        </small>
      </footer>
    </div>
  );
}
