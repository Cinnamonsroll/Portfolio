import { toDateString, type RawBlog } from "@/lib/types";

const blog: RawBlog = {
  title: "Making a Language: The Evaluator",
  description:
    "Building Spark's evaluator — environments, closures, operator overloading, return signals, and error reporting.",
  hero: { src: "/words/making-a-language-the-evaluator/hero.svg", alt: "AST nodes being evaluated" },
  tags: ["typescript", "compilers"],
  date: { start: toDateString("2026-05-18") },
};

export default blog;
