"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";

export function ImageEffects({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children);
    if (children.length === 0) return;

    children.forEach((child, i) => {
      (child as HTMLElement).style.transitionDelay =
        `${Math.min(i * 60, 300)}ms`;
      child.classList.add("reveal");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px 60px 0px", threshold: 0.05 },
    );

    children.forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  }, []);

  /* click lightbox */
  const openLightbox = useCallback((src: string, alt: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setClosing(false);
    setLightbox({ src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setLightbox(null);
      setClosing(false);
    }, 250);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const img = (e.target as HTMLElement).closest<HTMLImageElement>("img");
    if (!img) return;
    openLightbox(img.src, img.alt || "");
  }, [openLightbox]);

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, closeLightbox]);

  return (
    <>
      <div ref={containerRef} onClick={handleClick}>
        {children}
      </div>

      {lightbox && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 ${
            closing ? "lightbox-overlay--closing" : "lightbox-overlay"
          }`}
          onClick={closeLightbox}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") closeLightbox(); }}
          role="button"
          tabIndex={-1}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={lightbox.src}
            src={lightbox.src}
            alt={lightbox.alt}
            className={`max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl ${
              closing ? "lightbox-img--closing" : "lightbox-img"
            }`}
          />
          <button
            className="absolute top-5 right-5 size-9 flex items-center justify-center rounded-full border border-border bg-[#130f0c]/80 text-muted hover:text-primary hover:border-accent/50 transition-colors cursor-pointer"
            onClick={closeLightbox}
          >
            <XMarkIcon className="size-4" />
          </button>
        </div>
      )}
    </>
  );
}
