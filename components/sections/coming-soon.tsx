import { SparklesIcon } from "@heroicons/react/24/outline";

interface ComingSoonProps {
  label: string;
  description: string;
}

export function ComingSoon({ label, description }: ComingSoonProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-6 gap-3 select-none fade-in">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-accent/60 italic">{label}</span>
        <span className="inline-flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1 rounded-full bg-accent/60 dot-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </span>
      </div>

      <p className="text-xs text-muted text-center max-w-[18rem] leading-relaxed">
        {description}
      </p>

      <div className="sparkle-pulse">
        <SparklesIcon className="size-8 text-border mt-1" />
      </div>
    </div>
  );
}
