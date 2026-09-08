import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og/og-card";
import { blogs } from "@/lib/data/words";

export const alt = "Words";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) return new Response("Not found", { status: 404 });

  const tag = blog.tags?.[0] ?? "";

  return new ImageResponse(
    <OgCard
      eyebrow={tag}
      title={blog.title}
      subtitle={blog.description}
      footer="WORDS / PANCAKE.WTF"
    />,
    { ...size },
  );
}