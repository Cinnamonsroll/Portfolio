"use client";

import Image from "next/image";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { PRONOUNS, DESCRIPTION, GITHUB } from "@/lib/constants";
import { getAge } from "@/lib/utils";
import { AnimatedSVG } from "@/components/effects/animated-svg";
import { Pancake } from "@/components/effects/pancake";

interface HeroProps {
  dimmed?: boolean;
}

export function Hero({ dimmed }: HeroProps) {
  const age = useMemo(() => getAge(), []);

  return (
    <section
      className={`flex flex-col gap-8 transition-all duration-300 ${dimmed ? "blur-[1.5px] opacity-40" : ""}`}
    >
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start justify-between">
        <div className="flex-1 flex flex-col gap-3">
          <div className="max-w-64">
            <AnimatedSVG />
          </div>

          <motion.p
            className="text-secondary text-sm md:text-base leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {DESCRIPTION}
            <Pancake />
          </motion.p>
        </div>

        <motion.div
          className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg overflow-hidden border border-accent/25 hover:border-accent/50 transition-colors duration-200"
          >
            <Image
              src={"/juliette.png"}
              alt="Juliette"
              width={598}
              height={1141}
              className="size-24 md:size-62.5 object-cover object-top"
              draggable={false}
            />
          </a>
          <div className="flex flex-col items-center md:items-end text-sm">
            <span className="text-primary font-medium">{age} years</span>
            <span className="text-muted">{PRONOUNS}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
