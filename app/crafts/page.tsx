import Link from "next/link";
import Image from "next/image";
import { BackButton } from "@/components/ui/back-button";
import { crafts } from "@/lib/data/crafts";
import { STICKER_ICON, STICKER_OUTLINE, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crafts",
  description: "Small things made for fun",
};

export default function CraftsPage() {
  const sorted = [...crafts].sort((a, b) =>
    (b.date?.start ?? "").localeCompare(a.date?.start ?? ""),
  );

  return (
    <main className="min-h-screen w-full max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4 mb-12">
        <div className="md:mt-1">
          <BackButton href="/" variant="pill" />
        </div>

        <div className="flex-1 overflow-hidden rounded-lg border border-border">
          <Image
            src="/crafts/hero.svg"
            alt="Crafts"
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      <h1 className="text-[28px] md:text-[36px] font-semibold text-primary mb-2">
        Crafts
      </h1>
      <p className="text-secondary text-sm md:text-base mb-3 max-w-lg">
        Small things made for fun, just a playground of little ideas, experiments, and interactive
        toys. No grand plans, just stuff I wanted to mess around with.
      </p>
      <p className="text-muted text-xs mb-10 max-w-md">
        Most of these are just HTML, CSS, and JavaScript you can play with right here.
      </p>

      <div className="flex flex-col gap-3">
        {sorted.map((c) => (
          <Link
            key={c.slug}
            href={`/crafts/${c.slug}`}
            className="group flex items-center gap-4 px-4 py-3 rounded-lg border border-border hover:border-accent/30 transition-all duration-200"
          >
            {c.icon ? (
              <div className="size-10 shrink-0 bg-black/20 flex items-center justify-center">
                <Image
                  src={c.icon.src}
                  alt={c.icon.alt ?? c.title}
                  width={40}
                  height={40}
                  className="size-full object-cover rounded-md"
                  style={c.icon.src === STICKER_ICON ? { filter: STICKER_OUTLINE } : undefined}
                />
              </div>
            ) : (
              <div className="size-10 shrink-0 rounded-md bg-black/20 flex items-center justify-center text-lg">
                ?
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-medium text-primary group-hover:text-accent transition-colors duration-200 truncate">
                {c.title}
              </h2>
              {c.description && (
                <p className="text-[13px] text-secondary leading-snug line-clamp-1">
                  {c.description}
                </p>
              )}
            </div>
            <span className="text-[11px] text-muted tabular-nums shrink-0">
              {c.date?.start ? formatDate(c.date.start) : ""}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
