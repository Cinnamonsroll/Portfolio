import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og/og-card";
import { projects } from "@/lib/data/projects";

export const alt = "Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return new Response("Not found", { status: 404 });

  const tag = project.tags?.[0] ?? "";

  return new ImageResponse(
    <OgCard
      eyebrow={tag}
      title={project.title}
      subtitle={project.synopsis ?? project.description}
      footer="WORK / PANCAKE.WTF"
    />,
    { ...size },
  );
}