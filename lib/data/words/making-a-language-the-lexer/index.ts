import { toDateString, type RawBlog } from "@/lib/types";

const blog: RawBlog = {
  title: "Making a Language: The Lexer",
  description:
    "Building the lexer for Spark — turning source code into tokens with line/column tracking, comments, and escape sequences.",
  hero: { src: "/words/making-a-language-the-lexer/hero.svg", alt: "Source code being split into tokens" },
  tags: ["typescript", "compilers"],
  date: { start: toDateString("2026-05-18") },
};

export default blog;
