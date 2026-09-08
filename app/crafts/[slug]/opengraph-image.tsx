import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og/og-card";
import { crafts } from "@/lib/data/crafts";

export const alt = "Crafts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return crafts.map((c) => ({ slug: c.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const craft = crafts.find((c) => c.slug === slug);
  if (!craft) return new Response("Not found", { status: 404 });

  return new ImageResponse(
    <OgCard
      eyebrow="Crafts"
      title={craft.title}
      subtitle={craft.description}
      footer="CRAFTS / PANCAKE.WTF"
    />,
    { ...size },
  );
}