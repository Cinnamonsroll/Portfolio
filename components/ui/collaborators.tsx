import { memo } from "react";
import Image from "next/image";
import type { Collaborator } from "@/lib/types";

interface CollaboratorsProps {
  collaborators: Collaborator[];
}

export const Collaborators = memo(function Collaborators({ collaborators }: CollaboratorsProps) {
  if (collaborators.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-4 mt-5">
      {collaborators.map((c) => (
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
  );
});
