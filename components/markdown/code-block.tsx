"use client";

import { useRef, useEffect } from "react";
import { CHECK_ICON, COPY_ICON } from "@/lib/icons";

export function CodeBlock({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container
      .querySelectorAll<HTMLButtonElement>(".copy-btn")
      .forEach((btn) => {
        btn.addEventListener("click", async () => {
          const block = btn.closest<HTMLElement>(".code-block");
          if (!block) return;
          const code = block.querySelector("code");
          if (!code) return;

          try {
            await navigator.clipboard.writeText(code.textContent ?? "");
            btn.innerHTML = CHECK_ICON;
            setTimeout(() => {
              btn.innerHTML = COPY_ICON;
            }, 2000);
          } catch {
            /* silent */
          }
        });
      });
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
