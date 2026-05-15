"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/data/projects";
import { crafts } from "@/lib/data/crafts";
import { STICKER_ICON, STICKER_OUTLINE, formatDate, byDate } from "@/lib/utils";
import { SectionCard } from "./section-card";
import { EntryRow } from "@/components/ui/entry-row";

const cards = [
  { title: "work" as const, key: "work" },
  { title: "words" as const, key: "words" },
  { title: "crafts" as const, key: "crafts" },
  { title: "more" as const, key: "more" },
];

interface GridSectionProps {
  focusSlug: string | null;
  setFocusSlug: (slug: string | null) => void;
}

export function GridSection({ focusSlug, setFocusSlug }: GridSectionProps) {
  const active = (slug: string) => focusSlug === slug;
  const dimAll = focusSlug !== null;
  const sortedProjects = [...projects].sort(byDate).slice(0, 3);
  const hiddenProjects = [...projects].sort(byDate).slice(3);

  return (
    <motion.section
      className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {cards.map(({ title, key }) => {
        const workContent = title === "work" && (
          <>
            {sortedProjects.length > 0 ? (
              sortedProjects.map((p) => (
                <EntryRow
                  key={p.slug}
                  title={p.title}
                  date={p.date?.start}
                  images={[
                    ...(p.hero
                      ? [{ src: p.hero.src, alt: p.hero.alt }]
                      : []),
                    ...(p.images?.map((img) => ({
                      src: img.src,
                      alt: img.alt,
                    })) ?? []),
                  ]}
                  href={`/work/${p.slug}`}
                  dimmed={dimAll && !active(p.slug)}
                  isActive={active(p.slug)}
                  onHover={() => setFocusSlug(p.slug)}
                  onLeave={() => setFocusSlug(null)}
                />
              ))
            ) : (
              <EntryRow title="No projects yet" />
            )}
            {projects.length > 3 && (
              <EntryRow
                title=""
                isMore
                images={hiddenProjects.map((p) => ({
                  src: p.hero?.src ?? "",
                  alt: p.hero?.alt ?? p.title,
                }))}
                href="/work"
                dimmed={dimAll && !active("more")}
                isActive={active("more")}
                onHover={() => setFocusSlug("more")}
                onLeave={() => setFocusSlug(null)}
              />
            )}
          </>
        );
        const craftsContent = title === "crafts" && crafts.length > 0 && (
          <div className="flex flex-col">
            {crafts.map((c) => (
              <Link
                key={c.slug}
                href={`/crafts/${c.slug}`}
                className={`group relative flex items-center gap-4 py-2.5
                  after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-linear-to-r after:from-border after:to-transparent
                  last:after:hidden
                  transition-all duration-300
                  ${dimAll && !active(c.slug) ? "blur-[1.5px] opacity-40" : ""}
                  ${active(c.slug) ? "z-40" : ""}`}
                onMouseEnter={() => setFocusSlug(c.slug)}
                onMouseLeave={() => setFocusSlug(null)}
              >
                {c.icon ? (
                  <div className="size-8 shrink-0 bg-black/20 flex items-center justify-center">
                    <Image
                      src={c.icon.src}
                      alt={c.icon.alt ?? c.title}
                      width={32}
                      height={32}
                      className="size-full object-cover rounded"
                      style={c.icon.src === STICKER_ICON ? { filter: STICKER_OUTLINE } : undefined}
                    />
                  </div>
                ) : (
                  <div className="size-8 shrink-0 rounded bg-black/20 flex items-center justify-center text-sm text-muted">
                    ?
                  </div>
                )}
                <span className="flex-1 text-sm leading-none transition-colors duration-200 group-hover:text-accent">
                  {c.title}
                </span>
                <span className="text-[11px] text-secondary tabular-nums shrink-0 leading-none">
                  {c.date?.start ? formatDate(c.date.start) : ""}
                </span>
              </Link>
            ))}
          </div>
        );
        const childContent = workContent || craftsContent || null;

        return (
          <motion.div
            key={key}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <SectionCard title={title} dimmed={dimAll && title !== "work" && title !== "crafts"}>
              {childContent}
            </SectionCard>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
