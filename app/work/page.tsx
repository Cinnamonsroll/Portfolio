import Link from "next/link";
import Image from "next/image";
import { BackButton } from "@/components/ui/back-button";
import { projects } from "@/lib/data/projects";
import { byDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "Projects I've built",
};

export default function WorkPage() {
  const sorted = [...projects].sort(byDate);

  return (
    <main className="min-h-screen w-full max-w-5xl mx-auto px-6 py-16 md:py-24">
      <div className="mb-12 flex items-center gap-4">
        <BackButton href="/" />
      </div>

      <h1 className="text-[28px] md:text-[36px] font-semibold text-primary mb-2">
        Work
      </h1>
      <p className="text-secondary text-sm md:text-base mb-10 max-w-md">
        A collection of things I&apos;ve built.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map((p) => (
          <Link
            key={p.slug}
            href={`/work/${p.slug}`}
            className="group relative flex flex-col rounded-xl overflow-hidden bg-bg-primary border border-border hover:border-accent/30 transition-all duration-300"
          >
            <div className="relative aspect-16/10 overflow-hidden bg-black/20">
              {p.hero ? (
                <Image
                  src={p.hero.src}
                  alt={p.hero.alt ?? p.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105 object-top"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted text-sm">
                  no image
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  View project
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 p-4">
              {p.tags && p.tags.length > 0 && (
                <span className="text-[11px] uppercase tracking-wider text-accent font-medium">
                  {p.tags[0]}
                </span>
              )}
              <h2 className="text-[15px] font-semibold text-primary leading-snug">
                {p.title}
              </h2>
              {p.synopsis && (
                <p className="text-[13px] text-secondary leading-relaxed line-clamp-2">
                  {p.synopsis}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
