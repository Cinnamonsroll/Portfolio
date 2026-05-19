import Link from "next/link";
import Image from "next/image";
import { BackButton } from "@/components/ui/back-button";
import { blogs } from "@/lib/data/words";
import { byDate, formatDate } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Words",
  description: "Thoughts on code, music, and everything in between",
};

export default function WordsPage() {
  const sorted = [...blogs].sort(byDate);

  return (
    <main className="min-h-screen w-full max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-12 flex items-center gap-4">
        <BackButton href="/" />
      </div>

      <h1 className="text-[28px] md:text-[36px] font-semibold text-primary mb-2">
        Words
      </h1>
      <p className="text-secondary text-sm md:text-base mb-10 max-w-md">
        Thoughts on code, music, and everything in between.
      </p>

      <div className="flex flex-col gap-6">
        {sorted.map((b) => (
          <Link
            key={b.slug}
            href={`/words/${b.slug}`}
            className="group flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 rounded-lg border border-border hover:border-accent/30 transition-all duration-200"
          >
            {b.hero && (
              <div className="relative w-full sm:w-48 h-32 shrink-0 overflow-hidden rounded-md bg-black/20">
                <Image
                  src={b.hero.src}
                  alt={b.hero.alt ?? b.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 192px"
                />
              </div>
            )}
            <div className="flex flex-col gap-1.5 min-w-0 py-1">
              <h2 className="text-[15px] font-semibold text-primary group-hover:text-accent transition-colors duration-200 leading-snug">
                {b.title}
              </h2>
              <p className="text-[13px] text-secondary leading-relaxed line-clamp-2">
                {b.description}
              </p>
              <div className="flex items-center gap-3 mt-auto pt-1">
                {b.date?.start && (
                  <span className="text-[11px] text-muted tabular-nums">
                    {formatDate(b.date.start)}
                  </span>
                )}
                {b.tags && b.tags.length > 0 && (
                  <span className="flex items-center gap-1.5">
                    {b.tags.map((t) => (
                      <Tag key={t} tag={t} />
                    ))}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
