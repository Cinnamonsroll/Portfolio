import { toDateString, type RawBlog } from "@/lib/types";

const blog: RawBlog = {
  title: "Making a Language: Using Spark",
  description:
    "Tying everything together, the run function, complete Spark examples, and exercises for extending the language.",
  hero: { src: "/words/making-a-language-using-spark/hero.svg", alt: "Spark code in a playground" },
  tags: ["typescript", "compilers"],
  date: { start: toDateString("2026-05-18") },
};

export default blog;
