import type { ReactNode } from "react";
import { ComingSoon } from "./coming-soon";

interface SectionCardProps {
  title: string;
  children?: ReactNode;
  dimmed?: boolean;
}

const comingSoonMap: Record<string, { label: string; description: string }> = {
  words: {
    label: "thinking out loud",
    description: "Thoughts, tutorials, and case studies are brewing.",
  },
  more: {
    label: "something new",
    description: "A little surprise is on the way.",
  },
};

export function SectionCard({ title, children, dimmed }: SectionCardProps) {
  const cs = comingSoonMap[title];

  return (
    <section
      className={`flex flex-col gap-1 transition-all duration-300 ${dimmed ? "blur-[1.5px] opacity-40" : ""}`}
    >
      <h2 className="text-[17px] md:text-[20px] leading-[1.2] italic text-accent tracking-tight font-medium transition-all duration-200 hover:opacity-80 hover:tracking-[0.02em] hover:cursor-pointer">
        {title}
      </h2>

      {children ? (
        <div className="flex flex-col">{children}</div>
      ) : cs ? (
        <ComingSoon label={cs.label} description={cs.description} />
      ) : null}
    </section>
  );
}
