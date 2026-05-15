"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "./sparkles";

export function AnimatedSVG() {
  const [paths, setPaths] = useState<string[]>([]);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/juliette.svg")
      .then((r) => r.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const pathEls = doc.querySelectorAll("path");
        setPaths(Array.from(pathEls).map((p) => p.getAttribute("d")!));
      });
  }, []);

  if (paths.length === 0) {
    return <div className="h-8" />;
  }

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Sparkles hovered={hovered} parentRef={ref} />
      <svg
        viewBox="247.387 239.207 672.572 184.788"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-8 md:h-10 overflow-visible"
      >
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.08 }}
          />
        ))}
      </svg>
    </div>
  );
}
