import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og/og-card";

export const alt = "Work - Juliette";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Work"
      title="Projects I've built"
      subtitle="Apps, tools, and experiments with TypeScript, React, and more."
      footer="PANCAKE.WTF"
    />,
    { ...size },
  );
}