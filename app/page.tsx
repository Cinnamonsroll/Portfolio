"use client";

import { useState } from "react";
import { Hero } from "@/components/sections/hero";
import { GridSection } from "@/components/sections/grid-section";
import { LAST_UPDATED } from "@/lib/constants";

export default function Home() {
  const [focusSlug, setFocusSlug] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      {focusSlug && (
        <div className="fixed inset-0 z-30 bg-bg-primary/20 backdrop-blur-sm pointer-events-none" />
      )}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-16">
        <Hero dimmed={focusSlug !== null} />
        <GridSection focusSlug={focusSlug} setFocusSlug={setFocusSlug} />
      </main>
      <footer className="pb-6">
        <small className="text-[11px] text-muted block text-center">
          last updated{" "}
          {LAST_UPDATED.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </small>
      </footer>
    </div>
  );
}
