import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { PolaroidStack } from "./polaroid-stack";
import { formatDateShort } from "@/lib/utils";
import type { ProjectImage } from "@/lib/types";

interface EntryRowProps {
  title: string;
  date?: string;
  images?: ProjectImage[];
  href?: string;
  isMore?: boolean;
  dimmed?: boolean;
  isActive?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
}

export function EntryRow({
  title,
  date,
  images,
  href,
  isMore,
  dimmed,
  isActive,
  onHover,
  onLeave,
}: EntryRowProps) {
  const inner = (
    <>
      {images && images.length > 0 && <PolaroidStack images={images} />}

      <span className="flex-1 text-sm leading-none transition-colors duration-200 group-hover:text-accent">
        {isMore ? "More" : title}
      </span>

      {isMore ? (
        <span className="text-muted transition-colors duration-200 group-hover:text-accent shrink-0 leading-none">
          <ChevronRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      ) : date ? (
        <span className="text-[11px] text-secondary tabular-nums shrink-0 leading-none">
          {formatDateShort(date)}
        </span>
      ) : null}
    </>
  );

  const className = `group relative flex items-center gap-5 py-2.5
    after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-linear-to-r after:from-border after:to-transparent
    last:after:hidden
    ${href ? "cursor-pointer" : "cursor-default"}
    transition-all duration-300
    ${dimmed ? "blur-[1.5px] opacity-40" : ""}
    ${isActive ? "z-40" : ""}
  `;

  if (href) {
    return (
      <Link
        href={href}
        className={className}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={className} onMouseEnter={onHover} onMouseLeave={onLeave}>
      {inner}
    </div>
  );
}
