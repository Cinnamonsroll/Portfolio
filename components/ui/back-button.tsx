import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

interface BackButtonProps {
  href: string;
  variant?: "simple" | "pill";
}

export function BackButton({ href, variant = "simple" }: BackButtonProps) {
  if (variant === "pill") {
    return (
      <Link
        href={href}
        className="group self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:text-accent hover:border-accent/40 hover:bg-accent/4 transition-all duration-200"
      >
        <ArrowLeftIcon className="size-3 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span>Back</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-sm text-secondary hover:text-accent transition-colors duration-200"
    >
      <ArrowLeftIcon className="size-4" />
      back
    </Link>
  );
}
