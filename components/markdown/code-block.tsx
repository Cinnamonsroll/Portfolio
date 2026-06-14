"use client";

import { useRef, useEffect } from "react";
import { CHECK_ICON, COPY_ICON } from "@/lib/icons";

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for insecure contexts
  return new Promise((resolve, reject) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      resolve();
    } catch {
      reject();
    }
  });
}

function stripLineNumbers(codeEl: HTMLElement): string {
  const clone = codeEl.cloneNode(true) as HTMLElement;
  clone.querySelectorAll(".line-num").forEach((el) => el.remove());
  return clone.textContent ?? "";
}

export function CodeBlock({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = async (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".copy-btn");
      if (!btn) return;

      btn.style.pointerEvents = "none";

      const block = btn.closest<HTMLElement>(".code-block");
      if (!block) { btn.style.pointerEvents = ""; return; }

      const codeEl = block.querySelector("code");
      if (!codeEl) { btn.style.pointerEvents = ""; return; }

      const text = stripLineNumbers(codeEl);

      try {
        await copyToClipboard(text);
        btn.innerHTML = CHECK_ICON;
        setTimeout(() => {
          btn.innerHTML = COPY_ICON;
          btn.style.pointerEvents = "";
        }, 2000);
      } catch {
        btn.style.pointerEvents = "";
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
