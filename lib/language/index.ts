import { tokenize as tokenizeFn } from "./lexer";
import { parse as parseFn } from "./parser";
import { evaluate as evaluateFn, formatValue, setSource } from "./evaluator";
import { RuntimeError, ParseError } from "./types";
import type { Program } from "./types";

export function run(source: string): { output: string[]; error?: string } {
  try {
    const tokens = tokenizeFn(source);
    setSource(source);
    const program = parseFn(tokens);
    return evaluateFn(program);
  } catch (e) {
    if (e instanceof ParseError || e instanceof RuntimeError) {
      return { output: [], error: e.format(source) };
    }
    throw e;
  }
}

export function tokenize(source: string) {
  return tokenizeFn(source);
}

export function parse(tokens: ReturnType<typeof tokenizeFn>): Program {
  return parseFn(tokens);
}

export function evaluate(program: Program) {
  return evaluateFn(program);
}

export { formatValue };
export type { Program };