import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og/og-card";

export const alt = "Words - Juliette";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Words"
      title="Thoughts on code"
      subtitle="Writing about building things, one small language at a time."
      footer="PANCAKE.WTF"
    />,
    { ...size },
  );
}