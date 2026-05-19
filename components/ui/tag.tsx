import { memo } from "react";

interface TagProps {
  tag: string;
  size?: "sm" | "xs";
}

export const Tag = memo(function Tag({ tag, size = "xs" }: TagProps) {
  return (
    <span
      className={`${size === "xs" ? "text-xs" : "text-[11px]"} text-accent transition-colors hover:cursor-pointer hover:underline`}
    >
      #{tag}
    </span>
  );
});
