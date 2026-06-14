"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/lib/data/projects";
import { crafts } from "@/lib/data/crafts";
import { blogs } from "@/lib/data/words";
import { STICKER_ICON, STICKER_OUTLINE, formatDate, byDate } from "@/lib/utils";
import { SectionCard } from "./section-card";
import { EntryRow } from "@/components/ui/entry-row";
import { EMAIL, DISCORD, GITHUB, KOFI, LINKEDIN, X } from "@/lib/constants";

const cards = [
  { title: "work" as const, key: "work" },
  { title: "words" as const, key: "words" },
  { title: "crafts" as const, key: "crafts" },
  { title: "Contact me" as const, key: "contact" },
];

interface GridSectionProps {
  focusSlug: string | null;
  setFocusSlug: (slug: string | null) => void;
}

const contactMethods = [
  {
    label: "Email",
    value: EMAIL,
    href: "",
    colSpan: true,
    copy: true,
    gradient: "linear-gradient(135deg, rgba(234,67,53,0.15), rgba(251,188,5,0.08))",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
  {
    label: "GitHub",
    value: "Cinnamonsroll",
    href: GITHUB,
    colSpan: false,
    gradient: "linear-gradient(135deg, rgba(36,41,47,0.2), rgba(88,96,110,0.1))",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "X",
    value: "@Cinnamo44817432",
    href: X,
    colSpan: false,
    gradient: "linear-gradient(135deg, rgba(0,0,0,0.2), rgba(29,161,242,0.1))",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "starssailor",
    href: LINKEDIN,
    colSpan: false,
    gradient: "linear-gradient(135deg, rgba(0,119,181,0.18), rgba(10,156,186,0.08))",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Discord",
    value: "star__sailor",
    href: "",
    colSpan: false,
    copy: true,
    gradient: "linear-gradient(135deg, rgba(88,101,242,0.18), rgba(71,82,196,0.08))",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M20.317 4.37a19.8 19.8 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.7 18.7 0 0 0-5.487 0 12.6 12.6 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.028C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056c2.053 1.507 4.041 2.423 5.993 3.03a.078.078 0 0 0 .084-.028c.462-.63.873-1.295 1.226-1.994a.076.076 0 0 0-.042-.106c-.653-.248-1.274-.55-1.872-.892a.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.007.127 12.3 12.3 0 0 1-1.873.891.076.076 0 0 0-.04.107c.36.698.771 1.363 1.225 1.993a.076.076 0 0 0 .084.029c1.961-.607 3.95-1.522 6.002-3.03a.077.077 0 0 0 .031-.055c.5-5.177-.838-9.674-3.548-13.66a.061.061 0 0 0-.031-.029zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.334-.955 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
      </svg>
    ),
  },
  {
    label: "Ko-fi",
    value: "star__sailor",
    href: KOFI,
    colSpan: true,
    gradient: "linear-gradient(135deg, rgba(255,94,91,0.15), rgba(255,154,91,0.08))",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
        <path d="M23.881 8.948c-.524-.547-1.175-.643-1.987-.643h-1.174l-.165-.645c-.256-.98-.849-1.483-1.83-1.483H4.921c-.281 0-.576.05-.835.129l-.06-.026a5.82 5.82 0 0 0-.524 1.549c-.406 1.626-.225 3.338.466 4.606.617 1.145 1.617 1.94 2.755 2.215.652.159 1.345.182 1.998.145.848 1.542 2.314 2.146 4.376 2.146H12.4c.295 0 .593-.017.888-.053.64 1.237 1.302 2.318 1.626 3.913.175.98.284 1.972.284 2.963 0 .615.088 1.078.634 1.078.537 0 1.04-.397 1.04-1.105 0-1.515-.287-3.027-.734-4.439-.468-1.458-1.05-2.574-1.764-3.722.134-.066.265-.14.393-.224 2.086-.796 4.406-1.175 6.496-1.526.383-.062.745-.249 1.036-.523.763-.718 1.02-1.637.902-2.652-.049-.442-.214-.868-.488-1.211zm-2.488 2.616c-.314.284-.73.453-1.17.52a33.62 33.62 0 0 0-3.65.58c-.258.053-.514.106-.764.167-1.325.394-2.512.926-3.518 1.51-.381.22-.72.436-.998.666-.058.046-.107.096-.153.148-.165.19-.221.442-.17.691.174.592.646.925 1.407 1.028.44.06.877.068 1.31.07.096 0 .193-.003.29-.008.44 1.261.87 2.26 1.185 3.2.306.887.436 1.777.436 2.664 0 .394.084.676.276.868.296.296.691.296 1.134.296.795 0 1.35-.49 1.35-1.252 0-.873-.177-1.721-.437-2.549-.292-.906-.663-1.701-1.031-2.517-.135.038-.272.073-.41.104-.688.152-1.204.285-1.527.396-.51.17-.785.241-1.048.143-.165-.061-.316-.197-.447-.444-.129-.245-.187-.555-.187-.934 0-.581.12-1.085.354-1.498.741-1.299 2.029-1.6 3.499-1.867l.548-.1c.904-.166 1.69-.248 2.471-.25.532 0 .967.075 1.327.23.437.187.677.474.758.911.062.333-.02.672-.249.938z" />
      </svg>
    ),
  },
];

export function GridSection({ focusSlug, setFocusSlug }: GridSectionProps) {
  const active = (slug: string) => focusSlug === slug;
  const dimAll = focusSlug !== null;
  const sortedProjects = [...projects].sort(byDate).slice(0, 3);
  const hiddenProjects = [...projects].sort(byDate).slice(3);
  const sortedBlogs = [...blogs].sort(byDate).slice(0, 5);
  const hiddenBlogs = [...blogs].sort(byDate).slice(5);

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
                dimmed={dimAll && !active("more-work")}
                isActive={active("more-work")}
                onHover={() => setFocusSlug("more-work")}
                onLeave={() => setFocusSlug(null)}
              />
            )}
          </>
        );
        const wordsContent = title === "words" && sortedBlogs.length > 0 && (
          <div className="flex flex-col">
            {sortedBlogs.map((b) => (
              <EntryRow
                key={b.slug}
                title={b.title}
                date={b.date?.start}
                images={b.hero ? [{ src: b.hero.src, alt: b.hero.alt ?? b.title }] : []}
                href={`/words/${b.slug}`}
                dimmed={dimAll && !active(b.slug)}
                isActive={active(b.slug)}
                onHover={() => setFocusSlug(b.slug)}
                onLeave={() => setFocusSlug(null)}
              />
            ))}
            <EntryRow
              title=""
              isMore
              images={hiddenBlogs.map((b) => ({
                src: b.hero?.src ?? "",
                alt: b.hero?.alt ?? b.title,
              }))}
              href="/words"
              dimmed={dimAll && !active("more-words")}
              isActive={active("more-words")}
              onHover={() => setFocusSlug("more-words")}
              onLeave={() => setFocusSlug(null)}
            />
          </div>
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
        const contactContent = title === "Contact me" && (
          <div className="grid grid-cols-2 gap-2">
            {contactMethods.map((m) => {
              const Tag = m.copy ? "button" : "a";
              const extraProps = m.copy
                ? { type: "button" as const, onClick: () => { navigator.clipboard?.writeText(m.value); } }
                : { href: m.href, target: "_blank", rel: "noopener noreferrer" };
              return (
                <Tag
                  key={m.label}
                  className={`group flex items-center gap-3 p-2.5 rounded-lg border border-border hover:border-accent/60 transition-all duration-200 text-left ${m.colSpan ? "col-span-2" : ""}`}
                  style={{ background: m.gradient }}
                  {...extraProps}
                >
                  <span className="size-7 rounded-md bg-black/20 flex items-center justify-center text-muted group-hover:text-accent transition-colors shrink-0 backdrop-blur-sm">
                    {m.icon}
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13px] text-primary font-medium leading-snug">{m.label}</div>
                    <div className="text-[11px] text-muted truncate leading-snug">{m.value}</div>
                  </div>
                </Tag>
              );
            })}
          </div>
        );
        const childContent = workContent || wordsContent || craftsContent || contactContent || null;

        return (
          <motion.div
            key={key}
            variants={{
              hidden: { opacity: 0, y: 16 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <SectionCard title={title} dimmed={dimAll && title !== "work" && title !== "words" && title !== "crafts" && title !== "Contact me"}>
              {childContent}
            </SectionCard>
          </motion.div>
        );
      })}
    </motion.section>
  );
}
