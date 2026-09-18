import type { Metadata } from "next";
import { BackButton } from "@/components/ui/back-button";
import { DiscordEmbed } from "@/components/seo/discord-embed";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Page not found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen w-full max-w-3xl mx-auto px-6 py-16 md:py-24 flex flex-col gap-8">
      <DiscordEmbed path="not-found" url={SITE_URL}>
        <DiscordEmbed.title>Page not found</DiscordEmbed.title>
        <DiscordEmbed.subtitle>
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </DiscordEmbed.subtitle>
        <DiscordEmbed.buttons>
          <DiscordEmbed.button label="Back to pancake.wtf" url={SITE_URL} />
        </DiscordEmbed.buttons>
      </DiscordEmbed>
      <div>
        <BackButton href="/" />
      </div>

      <h1 className="text-[28px] md:text-[36px] font-semibold text-primary leading-tight">
        Page not found
      </h1>
      <p className="text-secondary text-sm md:text-base leading-relaxed max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
    </main>
  );
}