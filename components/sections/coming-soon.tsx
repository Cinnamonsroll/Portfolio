"use client";

import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";

interface ComingSoonProps {
  label: string;
  description: string;
}

const dot = {
  initial: { opacity: 0.3 },
  animate: { opacity: 1 },
};

export function ComingSoon({ label, description }: ComingSoonProps) {
  return (
    <motion.div
      className="relative flex flex-col items-center justify-center py-6 gap-3 select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-accent/60 italic">{label}</span>
        <span className="inline-flex gap-0.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="size-1 rounded-full bg-accent/60"
              variants={dot}
              animate="animate"
              initial="initial"
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 0.3,
                delay: i * 0.2,
              }}
            />
          ))}
        </span>
      </div>

      <p className="text-xs text-muted text-center max-w-[18rem] leading-relaxed">
        {description}
      </p>

      <motion.div
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <SparklesIcon className="size-8 text-border mt-1" />
      </motion.div>
    </motion.div>
  );
}
