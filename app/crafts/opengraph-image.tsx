import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og/og-card";

export const alt = "Crafts - Juliette";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Crafts"
      title="Small things made for fun"
      subtitle="A playground of little ideas, experiments, and interactive toys."
      footer="PANCAKE.WTF"
    />,
    { ...size },
  );
}