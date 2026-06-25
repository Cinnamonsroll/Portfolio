import { TokenType, type Token } from "./types";

const KEYWORDS: Record<string, TokenType> = {
  val: TokenType.Let,
  not: TokenType.Bang,
  and: TokenType.And,
  or: TokenType.Or,
  when: TokenType.If,
  else: TokenType.Else,
  func: TokenType.Fn,
  return: TokenType.Return,
  yes: TokenType.True,
  no: TokenType.False,
  nil: TokenType.Nil,
};

const SINGLE_TOKENS: Record<string, TokenType> = {
  "=": TokenType.Eq,
  "+": TokenType.Plus,
  "-": TokenType.Minus,
  "*": TokenType.Star,
  "/": TokenType.Slash,
  "%": TokenType.Percent,
  "<": TokenType.Lt,
  ">": TokenType.Gt,
  "(": TokenType.LParen,
  ")": TokenType.RParen,
  "{": TokenType.LBrace,
  "}": TokenType.RBrace,
  "[": TokenType.LBracket,
  "]": TokenType.RBracket,
  ",": TokenType.Comma,
};

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  let line = 1;
  let col = 1;

  function pos(): { line: number; col: number } {
    return { line, col };
  }

  function advance(n = 1) {
    for (let j = 0; j < n; j++) {
      if (source[i] === "\n") {
        line++;
        col = 1;
      } else {
        col++;
      }
      i++;
    }
  }

  while (i < source.length) {
    const ch = source[i];
    const start = pos();

    if (ch === " " || ch === "\t" || ch === "\r") {
      advance();
      continue;
    }

    if (ch === "\n") {
      advance();
      continue;
    }

    if (ch === "/" && source[i + 1] === "/") {
      const nl = source.indexOf("\n", i + 2);
      if (nl === -1) {
        i = source.length;
      } else {
        line++;
        col = 1;
        i = nl + 1;
      }
      continue;
    }

    if (ch === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      const limit = end === -1 ? source.length : end + 2;
      for (; i < limit; i++) {
        if (source[i] === "\n") {
          line++;
          col = 1;
        } else col++;
      }
      continue;
    }

    if (ch >= "0" && ch <= "9") {
      let num = "";
      let dotSeen = false;
      while (i < source.length) {
        const c = source[i];
        if (c >= "0" && c <= "9") {
          num += c;
          advance();
        } else if (
          !dotSeen &&
          c === "." &&
          i + 1 < source.length &&
          source[i + 1] >= "0" &&
          source[i + 1] <= "9"
        ) {
          dotSeen = true;
          num += c;
          advance();
        } else {
          break;
        }
      }
      tokens.push({ type: TokenType.Number, value: num, ...start });
      continue;
    }

    if (ch === '"') {
      advance();
      let str = "";
      while (i < source.length && source[i] !== '"') {
        if (source[i] === "\\" && i + 1 < source.length) {
          const next = source[i + 1];
          if (next === "n") str += "\n";
          else if (next === "t") str += "\t";
          else if (next === '"') str += '"';
          else if (next === "\\") str += "\\";
          else str += next;
          advance(2);
        } else {
          str += source[i];
          advance();
        }
      }
      advance();
      tokens.push({ type: TokenType.String, value: str, ...start });
      continue;
    }

    if (isAlpha(ch) || ch === "_") {
      let ident = "";
      while (
        i < source.length &&
        (isAlphaNumeric(source[i]) || source[i] === "_")
      ) {
        ident += source[i];
        advance();
      }
      const type = KEYWORDS[ident];
      tokens.push({
        type: type ?? TokenType.Identifier,
        value: ident,
        ...start,
      });
      continue;
    }

    if (source[i + 1] === "=") {
      if (ch === "=") {
        tokens.push({ type: TokenType.EqEq, value: "==", ...start });
        advance(2);
        continue;
      }
      if (ch === "!") {
        tokens.push({ type: TokenType.BangEq, value: "!=", ...start });
        advance(2);
        continue;
      }
      if (ch === "<") {
        tokens.push({ type: TokenType.LtEq, value: "<=", ...start });
        advance(2);
        continue;
      }
      if (ch === ">") {
        tokens.push({ type: TokenType.GtEq, value: ">=", ...start });
        advance(2);
        continue;
      }
    }
    if (ch === "=" && source[i + 1] === ">") {
      tokens.push({ type: TokenType.Arrow, value: "=>", ...start });
      advance(2);
      continue;
    }
    if (ch === "." && source[i + 1] === ".") {
      tokens.push({ type: TokenType.DotDot, value: "..", ...start });
      advance(2);
      continue;
    }

    const mapped = SINGLE_TOKENS[ch];
    if (mapped !== undefined) {
      tokens.push({ type: mapped, value: ch, ...start });
      advance();
      continue;
    }

    advance();
  }

  tokens.push({ type: TokenType.EOF, value: "", line, col });
  return tokens;
}

function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

function isAlpha(ch: string): boolean {
  return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
}

function isAlphaNumeric(ch: string): boolean {
  return isDigit(ch) || isAlpha(ch);
}
