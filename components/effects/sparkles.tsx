"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface Spark {
  id: number;
  x: number;
  y: number;
  rot: number;
  dx: number;
  dy: number;
}

interface SparklesProps {
  hovered: boolean;
  parentRef: React.RefObject<HTMLDivElement | null>;
}

export function Sparkles({ hovered, parentRef }: SparklesProps) {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const last = useRef(0);

  const addSpark = useCallback(
    (clientX: number, clientY: number) => {
      const now = Date.now();
      if (now - last.current < 60) return;
      last.current = now;
      const el = parentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setSparks((prev) => [
        ...prev.slice(-12),
        {
          id: now + Math.random(),
          x: clientX - rect.left,
          y: clientY - rect.top,
          rot: Math.random() * 360,
          dx: (Math.random() - 0.5) * 10,
          dy: -10 - Math.random() * 8,
        },
      ]);
    },
    [parentRef],
  );

  useEffect(() => {
    if (!hovered) return;

    const el = parentRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      addSpark(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      setSparks([]);
    };
  }, [hovered, addSpark, parentRef]);

  useEffect(() => {
    if (!hovered) return;
    const interval = setInterval(() => {
      setSparks((prev) => prev.slice(1));
    }, 500);
    return () => clearInterval(interval);
  }, [hovered]);

  return (
    <>
      {sparks.map((s) => (
        <div
          key={s.id}
          className="spark"
          style={{
            left: s.x - 7,
            top: s.y - 27,
            ["--sx" as string]: `${s.dx}px`,
            ["--sy" as string]: `${s.dy}px`,
            ["--sr" as string]: `${s.rot}deg`,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="var(--accent)"
            style={{ filter: "drop-shadow(0 0 4px var(--accent))" }}
          >
            <path d="M7 0 L8.5 5.5 L14 7 L8.5 8.5 L7 14 L5.5 8.5 L0 7 L5.5 5.5 Z" />
          </svg>
        </div>
      ))}
    </>
  );
}
