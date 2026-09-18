import type { Metadata } from "next";
import { NAME, SHORT_DESCRIPTION, SITE_URL } from "@/lib/constants";
import { HomeClient } from "./home-client";
import { DiscordEmbed } from "@/components/seo/discord-embed";

export const metadata: Metadata = {
  title: {
    absolute: `${NAME} - Developer, Musician & Teacher`,
  },
  description: SHORT_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${NAME} - Developer, Musician & Teacher`,
    description: SHORT_DESCRIPTION,
    url: "https://pancake.wtf",
    siteName: NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${NAME} - Developer, Musician & Teacher`,
    description: SHORT_DESCRIPTION,
    creator: "@Cinnamo44817432",
  },
};

export default function Home() {
  return (
    <>
      <DiscordEmbed path="page">
        <DiscordEmbed.title>{NAME}</DiscordEmbed.title>
        <DiscordEmbed.subtitle>
          Developer, musician, and aspiring French teacher.
        </DiscordEmbed.subtitle>
        <DiscordEmbed.image
          src={`${SITE_URL}/juliette.png`}
          description={NAME}
        />
        <DiscordEmbed.content>
          I build things with TypeScript and React, learn French, and teach
          along the way.
        </DiscordEmbed.content>
        <DiscordEmbed.buttons>
          <DiscordEmbed.button label="pancake.wtf" url={SITE_URL} />
        </DiscordEmbed.buttons>
      </DiscordEmbed>
      <HomeClient />
    </>
  );
}