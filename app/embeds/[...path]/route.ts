import { buildDiscordEmbed } from "@/lib/embeds/build";
import { getEmbed } from "@/lib/embeds";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const content = getEmbed(path);
  if (!content) return new Response("Not found", { status: 404 });

  return new Response(JSON.stringify(buildDiscordEmbed(content)), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}