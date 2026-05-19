import { toDateString, type RawBlog } from "@/lib/types";

const blog: RawBlog = {
  title: "Making a Language: The Parser",
  description:
    "Building a recursive descent parser with precedence climbing for Spark's expressions, statements, and control flow.",
  hero: { src: "/words/making-a-language-the-parser/hero.svg", alt: "Token stream being parsed into an AST" },
  tags: ["typescript", "compilers"],
  date: { start: toDateString("2026-05-18") },
};

export default blog;
