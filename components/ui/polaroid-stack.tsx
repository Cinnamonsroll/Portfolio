import Image from "next/image";
import type { ProjectImage } from "@/lib/types";

interface PolaroidStackProps {
  images: ProjectImage[];
}

const CARD_W = 57;
const CARD_H = 32;
const BORDER = 2.8;

const rest = [
  { x: -0.24, y: 0.95, rotate: 6.6 },
  { x: -1.42, y: -1.93, rotate: -5.8 },
  { x: 0, y: 0, rotate: 0.85 },
];
const fan = [
  { x: -14, y: -14, rotate: -8 },
  { x: 0, y: -18, rotate: 0 },
  { x: 14, y: -14, rotate: 8 },
];

export function PolaroidStack({ images }: PolaroidStackProps) {
  if (images.length === 0) return null;

  const cards = images.slice(0, 3);

  return (
    <div className="relative flex h-8.5 w-15 shrink-0 items-center justify-center pointer-events-none">
      {cards.map((card, i) => (
        <div
          key={i}
          className="polaroid-card absolute"
          style={
            {
              "--rx": `${rest[i].x}px`,
              "--ry": `${rest[i].y}px`,
              "--rrot": `${rest[i].rotate}deg`,
              "--hx": `${fan[i].x}px`,
              "--hy": `${fan[i].y}px`,
              "--hrot": `${fan[i].rotate}deg`,
            } as React.CSSProperties
          }
        >
          <div
            className="pointer-events-none select-none relative overflow-hidden"
            style={{
              width: CARD_W,
              height: CARD_H,
              border: `${BORDER}px solid #fff`,
              borderRadius: 2,
              boxShadow: "0 1.5px 2px -0.25px rgba(0,0,0,0.18)",
            }}
          >
            <Image
              src={card.src}
              alt={card.alt ?? ""}
              width={CARD_W * 2}
              height={CARD_H * 2}
              className="absolute inset-0 size-full object-cover"
              draggable={false}
            />
            <div className="absolute inset-0 shadow-[inset_0px_0px_1px_0.5px_rgba(0,0,0,0.1)]" />
          </div>
        </div>
      ))}
    </div>
  );
}
