"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BackButton } from "@/components/ui/back-button";
import { formatDate } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";
import type { Project } from "@/lib/types";
import { ImageEffects } from "@/components/effects/image-effects";
import { CodeBlock } from "@/components/markdown/code-block";

interface Props {
  project: Project & { contentHtml?: string };
}

export function ProjectPageClient({ project }: Props) {
  return (
    <motion.main
      className="min-h-screen w-full max-w-2xl mx-auto px-6 py-16 md:py-24"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4 mb-10">
        <BackButton href="/" variant="pill" />

        {project.hero && (
          <div className="flex-1 overflow-hidden rounded-lg border border-border">
            <Image
              src={project.hero.src}
              alt={project.hero.alt ?? project.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>
        )}
      </div>

      <header className="mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold text-primary leading-tight">
          {project.title}
        </h1>
        {project.synopsis && (
          <p className="text-sm text-muted mt-2">{project.synopsis}</p>
        )}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs text-muted">
          {project.status && (
            <span
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full capitalize ${
                project.status === "active"
                  ? "bg-accent/15 text-accent"
                  : project.status === "archived"
                    ? "bg-border/40 text-muted"
                    : "bg-border/30 text-secondary"
              }`}
            >
              {project.status}
            </span>
          )}

          {project.date?.start && (
            <span className="tabular-nums">
              {formatDate(project.date.start, true)}
              {project.date.end && ` — ${formatDate(project.date.end, true)}`}
            </span>
          )}

          {project.tags.length > 0 && (
            <span className="flex items-center gap-2">
              {project.tags.map((t) => (
                <Tag key={t} tag={t} />
              ))}
            </span>
          )}
        </div>

        {(project.collaborators && project.collaborators.length > 0) ||
        (project.links && project.links.length > 0) ? (
          <div className="flex justify-between items-start mt-4">
            <div className="flex flex-wrap items-center gap-4">
              {project.collaborators?.map((c) => (
                <a
                  key={c.github}
                  href={c.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group"
                >
                  <Image
                    src={`https://github.com/${c.name}.png`}
                    alt={c.name}
                    width={28}
                    height={28}
                    className="size-7 rounded-full ring-2 ring-border group-hover:ring-accent/50 transition-all duration-200"
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="text-xs font-medium text-primary group-hover:text-accent transition-colors duration-200">
                      {c.name}
                    </span>
                    {c.role && (
                      <span className="text-[10px] text-muted">{c.role}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>

            {project.links && project.links.length > 0 && (
              <div className="flex items-center gap-3 shrink-0">
                {project.links.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:text-accent-light underline decoration-accent/30 hover:decoration-accent transition-all duration-200"
                  >
                    {link.name} ↗
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </header>

      {project.contentHtml && (
        <ImageEffects>
          <CodeBlock>
            <div
              className="prose-custom flex flex-col gap-2"
              dangerouslySetInnerHTML={{ __html: project.contentHtml }}
            />
          </CodeBlock>
        </ImageEffects>
      )}
    </motion.main>
  );
}
