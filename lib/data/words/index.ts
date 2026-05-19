import type { Blog } from "@/lib/types";
import { slugify } from "@/lib/utils";
import makeALanguage from "./making-a-programming-language/index";
import lexer from "./making-a-language-the-lexer/index";
import parser from "./making-a-language-the-parser/index";
import evaluator from "./making-a-language-the-evaluator/index";
import usingSpark from "./making-a-language-using-spark/index";

const raw = [makeALanguage, lexer, parser, evaluator, usingSpark];

export const blogs: Blog[] = raw.map((b) => ({
  ...b,
  slug: slugify(b.title),
}));
