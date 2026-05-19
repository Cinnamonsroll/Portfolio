import fs from "fs";
import path from "path";

export function getMarkdownContent(type: "projects" | "words", slug: string): string {
  const filePath = path.join(process.cwd(), "lib", "data", type, slug, "content.md");
  return fs.readFileSync(filePath, "utf-8");
}
