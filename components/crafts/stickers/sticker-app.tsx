"use client";

import { useState, useCallback, useRef } from "react";

const CDN = "https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/svg";

const EMOJIS = [
  ["1f49c", "heart"],
  ["1f44d", "thumbs up"],
  ["1f525", "fire"],
  ["2728", "sparkles"],
  ["1f31f", "glowing star"],
  ["1f389", "party popper"],
  ["1f308", "rainbow"],
  ["1f496", "sparkling heart"],
  ["1f953", "bacon"],
  ["1f34c", "banana"],
] as const;

type PlacedSticker = {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotate: number;
  entering: boolean;
};

const OUTLINE =
  "drop-shadow(-2px 0 0 white) drop-shadow(2px 0 0 white) drop-shadow(0 -2px 0 white) drop-shadow(0 2px 0 white) drop-shadow(0 0 4px rgba(0,0,0,0.15))";

const STICKER_SZ = 44;
const HALF_SZ = STICKER_SZ / 2;

const randomRotate = () => Math.floor(Math.random() * 24 - 12);

const VB_W = 500;
const VB_H = 500;
const PP = { x: 65, y: 20, w: 370, h: 450 };

function StickerImg({ code, size }: { code: string; size: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${CDN}/${code}.svg`}
      alt=""
      className="pointer-events-none select-none"
      draggable={false}
      style={{ width: size, height: size, filter: OUTLINE }}
    />
  );
}

export function StickerApp() {
  const [placed, setPlaced] = useState<PlacedSticker[]>([]);
  const idCounter = useRef(0);
  const [poof, setPoof] = useState<{ x: number; y: number; id: number } | null>(
    null,
  );
  const [drag, setDrag] = useState<{
    emoji: string;
    x: number;
    y: number;
  } | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    emoji: string;
    isDragging: boolean;
  } | null>(null);
  const poofTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      emoji: target.dataset.emoji ?? "",
      isDragging: false,
    };
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    if (!d.isDragging) {
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (Math.abs(dx) + Math.abs(dy) <= 8) return;
      d.isDragging = true;
    }
    setDrag({ emoji: d.emoji, x: e.clientX, y: e.clientY });
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      dragRef.current = null;
      setDrag(null);

      if (!d?.isDragging) return;

      const el = surfaceRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();

      const sx = r.width / VB_W;
      const sy = r.height / VB_H;
      const onPaper =
        e.clientX >= r.left + PP.x * sx &&
        e.clientX <= r.left + (PP.x + PP.w) * sx &&
        e.clientY >= r.top + PP.y * sy &&
        e.clientY <= r.top + (PP.y + PP.h) * sy;

      if (!onPaper) {
        const id = Date.now() + Math.random();
        setPoof({ x: e.clientX, y: e.clientY, id });
        clearTimeout(poofTimer.current);
        poofTimer.current = setTimeout(
          () => setPoof((p) => (p?.id === id ? null : p)),
          400,
        );
        return;
      }

      const newId = idCounter.current++;
      setPlaced((prev) => [
        ...prev,
        {
          id: newId,
          emoji: d.emoji,
          x: e.clientX - r.left - HALF_SZ,
          y: e.clientY - r.top - HALF_SZ,
          rotate: randomRotate(),
          entering: true,
        },
      ]);
      setSelectedId(newId);
    },
    [],
  );

  const handlePointerCancel = useCallback(() => {
    dragRef.current = null;
    setDrag(null);
  }, []);

  const endEntry = useCallback((id: number) => {
    setPlaced((prev) =>
      prev.map((s) => (s.id === id ? { ...s, entering: false } : s)),
    );
  }, []);

  const rotateSticker = useCallback((id: number, deg: number) => {
    setPlaced((prev) =>
      prev.map((s) => (s.id === id ? { ...s, rotate: s.rotate + deg } : s)),
    );
  }, []);

  const removeSticker = useCallback((id: number) => {
    setPlaced((prev) => prev.filter((s) => s.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  }, []);

  const selected = placed.find((s) => s.id === selectedId);

  return (
    <>
      <div className="flex flex-col gap-6 touch-none">
        <div className="flex flex-wrap gap-2 p-3 bg-black/10 rounded-lg justify-center">
          {EMOJIS.map(([code, label]) => (
            <button
              key={code}
              type="button"
              data-emoji={code}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
              className="size-10 flex items-center justify-center rounded-md bg-black/5 hover:bg-accent/10 transition-colors duration-200 cursor-grab active:cursor-grabbing select-none"
              aria-label={label}
              style={{ touchAction: "none" }}
            >
              <StickerImg code={code} size={22} />
            </button>
          ))}
        </div>

        <div
          ref={surfaceRef}
          className="relative w-full overflow-hidden select-none aspect-500/500"
        >
          <svg
            viewBox="0 0 500 500"
            className="w-full h-full pointer-events-none"
          >
            <defs>
              <linearGradient id="page" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f8f4ec" />
                <stop offset="100%" stopColor="#efe8dc" />
              </linearGradient>
              <linearGradient id="shadow" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,0,0,0.12)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </linearGradient>
            </defs>

            <rect
              x="73"
              y="28"
              width="370"
              height="450"
              rx="4"
              fill="rgba(0,0,0,0.06)"
            />
            <rect
              x="65"
              y="20"
              width="370"
              height="450"
              rx="4"
              fill="url(#page)"
            />
            <rect
              x="65"
              y="20"
              width="370"
              height="450"
              rx="4"
              fill="url(#shadow)"
            />

            <g fill="#130f0c" fillOpacity="0.55">
              {[52, 92, 132, 172, 212, 252, 292, 332, 372, 412, 452].map(
                (y) => (
                  <circle key={y} cx="81" cy={y} r="4.5" />
                ),
              )}
            </g>
            {[43, 83, 123, 163, 203, 243, 283, 323, 363, 403, 443].map((y) => (
              <path
                key={y}
                d={`M81 ${y} Q91 ${y - 2} 88 ${y + 5}`}
                fill="none"
                stroke="#999"
                strokeWidth="1.5"
              />
            ))}

            {[
              68, 92, 116, 140, 164, 188, 212, 236, 260, 284, 308, 332, 356,
              380, 404, 428, 452,
            ].map((y) => (
              <line
                key={y}
                x1="105"
                y1={y}
                x2="415"
                y2={y}
                stroke="#d5cdc0"
                strokeWidth="0.5"
              />
            ))}
            <line
              x1="130"
              y1="50"
              x2="130"
              y2="440"
              stroke="#e8b4b4"
              strokeWidth="0.5"
              opacity="0.3"
              strokeDasharray="4 3"
            />

            <g opacity="0.12">
              {[
                "M143 78 Q158 73 173 78 T203 78",
                "M143 102 Q158 97 173 102 T198 102",
                "M143 126 Q168 121 188 126 T218 126",
                "M143 150 Q158 146 173 150 T208 150",
                "M143 174 Q158 169 173 174 T198 174",
              ].map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke="#a89f93"
                  strokeWidth="1"
                  fill="none"
                />
              ))}
            </g>
            <g opacity="0.08">
              {[
                "M228 78 Q248 73 263 78",
                "M223 102 Q238 97 253 102",
                "M238 126 Q258 121 273 126",
              ].map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke="#a89f93"
                  strokeWidth="1"
                  fill="none"
                />
              ))}
            </g>

            <g opacity="0.2">
              <path
                d="M380 230 L383 237 L390 237 L384 242 L386 249 L380 244 L374 249 L376 242 L370 237 L377 237 Z"
                stroke="#e8c44a"
                strokeWidth="0.8"
                fill="none"
              />
              <path
                d="M370 250 L390 250"
                stroke="#e8c44a"
                strokeWidth="0.8"
                fill="none"
                opacity="0.15"
              />
            </g>
            <path d="M435 20 L435 32 L423 20 Z" fill="#e5ddd0" />
          </svg>

          {placed.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setSelectedId(s.id === selectedId ? null : s.id)}
              className="absolute cursor-grab active:cursor-grabbing select-none"
              style={{
                left: s.x,
                top: s.y,
                filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))",
                transform: `rotate(${s.rotate}deg)`,
                zIndex: selectedId === s.id ? 10 : 1,
                animation: s.entering
                  ? "bounce-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                  : undefined,
              }}
              onAnimationEnd={() => endEntry(s.id)}
              aria-label={`Sticker ${s.emoji}`}
            >
              <StickerImg code={s.emoji} size={STICKER_SZ} />
            </button>
          ))}

          {selected && (
            <div
              className="absolute flex items-center gap-1 z-20"
              style={{
                left: selected.x + HALF_SZ,
                top: selected.y - 24,
                transform: "translateX(-50%)",
              }}
            >
              <button
                onClick={() => rotateSticker(selected.id, -5)}
                className="size-6 flex items-center justify-center rounded bg-black/70 hover:bg-accent text-white text-xs transition-colors duration-200"
                title="rotate left"
              >
                ↺
              </button>
              <button
                onClick={() => rotateSticker(selected.id, 5)}
                className="size-6 flex items-center justify-center rounded bg-black/70 hover:bg-accent text-white text-xs transition-colors duration-200"
                title="rotate right"
              >
                ↻
              </button>
              <button
                onClick={() => removeSticker(selected.id)}
                className="size-6 flex items-center justify-center rounded bg-black/70 hover:bg-red-400 text-white text-xs transition-colors duration-200"
                title="remove"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {poof && (
          <div
            key={poof.id}
            className="fixed pointer-events-none text-3xl z-50"
            style={{
              left: poof.x,
              top: poof.y,
              transform: "translate(-50%, -50%)",
              animation: "poof 0.35s ease-out forwards",
            }}
          >
            💨
          </div>
        )}
      </div>

      {drag && (
        <div
          className="fixed pointer-events-none z-50"
          style={{ left: drag.x - HALF_SZ, top: drag.y - HALF_SZ }}
        >
          <StickerImg code={drag.emoji} size={STICKER_SZ} />
        </div>
      )}
    </>
  );
}
