import fs from "node:fs";
import path from "node:path";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/constants";
import {
  DiscordEmbedTitle,
  DiscordEmbedSubtitle,
  DiscordEmbedContent,
  DiscordEmbedImage,
  DiscordEmbedGallery,
  DiscordEmbedButton,
  DiscordEmbedButtons,
  serializeDiscordEmbed,
} from "@/lib/embeds/build";

const DEFAULT_ACCENT_COLOR = "#e8c44a";
const SAFE_SEGMENT = /^[a-z0-9-]+$/i;

function writeEmbedFile(embedPath: string, payload: unknown): void {
  const segments = embedPath.split("/").filter(Boolean);
  if (segments.length === 0) return;
  if (!segments.every((segment) => SAFE_SEGMENT.test(segment))) return;

  try {
    const dir = path.join(process.cwd(), "public", "embeds");
    const filePath = path.join(dir, ...segments) + ".json";
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(payload));
  } catch {
    // Best effort: Discord falls back to the Open Graph tags if this fails.
  }
}

type DiscordEmbedRootProps = {
  path: string;
  accentColor?: string | number;
  children?: ReactNode;
};

function DiscordEmbedRoot({
  path: embedPath,
  accentColor = DEFAULT_ACCENT_COLOR,
  children,
}: DiscordEmbedRootProps) {
  writeEmbedFile(embedPath, serializeDiscordEmbed({ accentColor, children }));

  return (
    <>
      {children}
      <link
        rel="discord:component-embed"
        type="application/json"
        href={`${SITE_URL}/embeds/${embedPath}.json`}
      />
    </>
  );
}

export const DiscordEmbed = Object.assign(DiscordEmbedRoot, {
  title: DiscordEmbedTitle,
  subtitle: DiscordEmbedSubtitle,
  content: DiscordEmbedContent,
  image: DiscordEmbedImage,
  gallery: DiscordEmbedGallery,
  button: DiscordEmbedButton,
  buttons: DiscordEmbedButtons,
});