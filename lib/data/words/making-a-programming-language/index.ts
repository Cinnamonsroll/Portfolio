import { toDateString, type RawBlog } from "@/lib/types";

const blog: RawBlog = {
  title: "Making a Programming Language",
  description:
    "A step-by-step guide to building your own programming language in TypeScript, covering lexing, parsing, evaluation, variables, math, arrays, and more.",
  hero: { src: "/words/making-a-programming-language/hero.svg", alt: "Source code to AST diagram" },
  tags: ["typescript", "compilers"],
  date: { start: toDateString("2026-05-18") },
};

export default blog;
