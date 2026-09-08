import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og/og-card";
import { NAME } from "@/lib/constants";

export const alt = `${NAME} - Developer, Musician & Teacher`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgCard
      eyebrow="Portfolio"
      title={NAME}
      subtitle="Developer, musician, and aspiring French teacher."
      footer="PANCAKE.WTF"
    />,
    { ...size },
  );
}