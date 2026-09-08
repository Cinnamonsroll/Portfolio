import Image from "next/image";
import { BackButton } from "@/components/ui/back-button";
import { crafts } from "@/lib/data/crafts";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { StickerApp } from "@/components/crafts/stickers/sticker-app";
import { JsonLd } from "@/components/seo/json-ld";
import { NAME } from "@/lib/constants";

const SITE_URL = "https://pancake.wtf";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const craft = crafts.find((c) => c.slug === slug);
  if (!craft) return {};
  const url = `${SITE_URL}/crafts/${slug}`;
  const title = craft.title;
  return {
    title,
    description: craft.description,
    alternates: {
      canonical: `/crafts/${slug}`,
    },
    openGraph: {
      title,
      description: craft.description,
      url,
      siteName: NAME,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: craft.description,
      creator: "@Cinnamo44817432",
    },
  };
}

export function generateStaticParams() {
  return crafts.map((c) => ({ slug: c.slug }));
}

export default async function CraftPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const craft = crafts.find((c) => c.slug === slug);
  if (!craft) notFound();

  const url = `${SITE_URL}/crafts/${slug}`;

  return (
    <main className="min-h-screen w-full max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CreativeWork",
          name: craft.title,
          description: craft.description,
          url,
          creator: {
            "@type": "Person",
            name: NAME,
            url: SITE_URL,
          },
          inLanguage: "en-US",
        }}
      />

      <div className="mb-12 flex items-center gap-4">
        <BackButton href="/crafts" />
      </div>

      <div className="flex items-center gap-3 mb-2">
        {craft.icon && (
          <Image
            src={craft.icon.src}
            alt={craft.icon.alt ?? craft.title}
            width={32}
            height={32}
            className="size-8 rounded"
          />
        )}
        <h1 className="text-[28px] md:text-[36px] font-semibold text-primary">
          {craft.title}
        </h1>
      </div>

      <p className="text-secondary text-sm md:text-base mb-10 max-w-md">
        {craft.description}
      </p>

      {slug === "stickers" && <StickerApp />}
    </main>
  );
}
