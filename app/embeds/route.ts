import { buildDiscordEmbed } from "@/lib/embeds/build";
import { getEmbed } from "@/lib/embeds";

export async function GET() {
  const content = getEmbed(["page"]);
  if (!content) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify(buildDiscordEmbed(content)), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}