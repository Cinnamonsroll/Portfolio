import { SITE_URL } from "@/lib/constants";

export function DiscordEmbedLink({ path }: { path: string }) {
  return (
    <link
      rel="discord:component-embed"
      type="application/json"
      href={`${SITE_URL}/embeds/${path}.json`}
    />
  );
}