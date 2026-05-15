import fs from "fs";
import path from "path";

export function getProjectContent(slug: string): string {
  const filePath = path.join(
    process.cwd(),
    "lib",
    "data",
    "projects",
    slug,
    "content.md"
  );
  return fs.readFileSync(filePath, "utf-8");
}
