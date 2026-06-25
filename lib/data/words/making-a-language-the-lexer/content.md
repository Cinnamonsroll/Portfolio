In the [previous part](/words/making-a-programming-language), we laid out Spark's syntax and type system. Now we build the first stage of the pipeline: the lexer.

The lexer reads source code character by character and groups them into tokens. Think of it like looking at a sentence and identifying each word and punctuation mark without caring about what the sentence means. It produces a flat list that the parser will later give structure to.

## Keywords

```typescript
// lib/language/lexer.ts
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
```

A simple lookup table maps Spark's keyword strings to their token types. When the lexer reads an identifier, it checks this map. If the word is a keyword, it emits the corresponding type instead of a generic `Identifier` token. This is how `val` becomes a `Let` token while `x` stays an `Identifier`.

## Position Tracking

```typescript
// lib/language/lexer.ts
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
```

Every token needs to know where it came from. When something goes wrong during parsing or evaluation, we point to the exact line and column. The `advance` function moves the index forward one character at a time, incrementing the line counter and resetting the column whenever it hits a newline.

## Whitespace and Comments

```typescript
// lib/language/lexer.ts
if (ch === " " || ch === "\t" || ch === "\r") {
  advance();
  continue;
}

if (ch === "\n") {
  advance();
  continue;
}
```

Whitespace and newlines are discarded immediately. They have no meaning in Spark. The lexer just skips them and moves on.

```typescript
// lib/language/lexer.ts
if (ch === "/" && source[i + 1] === "/") {
  while (i < source.length && source[i] !== "\n") advance();
  continue;
}

if (ch === "/" && source[i + 1] === "*") {
  advance(2);
  while (i < source.length && !(source[i] === "*" && source[i + 1] === "/"))
    advance();
  advance(2);
  continue;
}
```

Two kinds of comments: single-line `//` which skips until a newline, and block `/* */` which skips everything until the closing delimiter. Block comments handle multiple lines correctly because `advance` updates the line counter automatically.

## Numbers

```typescript
// lib/language/lexer.ts
if (isDigit(ch)) {
  let num = "";
  while (i < source.length && (isDigit(source[i]) || source[i] === ".")) {
    num += source[i];
    advance();
  }
  tokens.push({ type: TokenType.Number, value: num, ...start });
  continue;
}
```

Number literals consume consecutive digits and decimal points. The raw string is stored as the token's value. The parser will handle converting it to an actual numeric type.

## Strings

```typescript
// lib/language/lexer.ts
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
  advance(); // skip closing "
  tokens.push({ type: TokenType.String, value: str, ...start });
  continue;
}
```

String literals accumulate characters between double quotes. Escape sequences (`\n`, `\t`, `\"`, `\\`) are recognised and replaced with their actual character values. The closing quote is consumed but not added to the string value.

## Identifiers and Keywords

```typescript
// lib/language/lexer.ts
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
```

Identifiers start with a letter or underscore and consume alphanumeric characters. After reading the full word, the lexer checks the keywords map. If the word is a keyword like `when` or `func`, the token gets that keyword's type. Otherwise it's a regular `Identifier`.

## Operators

```typescript
// lib/language/lexer.ts
if (ch === "=" && source[i + 1] === "=") {
  tokens.push({ type: TokenType.EqEq, value: "==", ...start });
  advance(2);
  continue;
}
if (ch === "!" && source[i + 1] === "=") {
  tokens.push({ type: TokenType.BangEq, value: "!=", ...start });
  advance(2);
  continue;
}
if (ch === "<" && source[i + 1] === "=") {
  tokens.push({ type: TokenType.LtEq, value: "<=", ...start });
  advance(2);
  continue;
}
if (ch === ">" && source[i + 1] === "=") {
  tokens.push({ type: TokenType.GtEq, value: ">=", ...start });
  advance(2);
  continue;
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
```

Two-character operators are checked before single-character ones. This matters because `=` alone is an assignment, but `==` is equality. The lexer peeks at the next character and if it matches a known pair, consumes both at once with `advance(2)`.

```typescript
// lib/language/lexer.ts
const singleMap: Record<string, TokenType> = {
  "=": TokenType.Eq,
  "+": TokenType.Plus,
  "-": TokenType.Minus,
  "*": TokenType.Star,
  "/": TokenType.Slash,
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

const mapped = singleMap[ch];
if (mapped !== undefined) {
  tokens.push({ type: mapped, value: ch, ...start });
  advance();
  continue;
}
```

Single-character operators and delimiters use another lookup map. Brackets, parentheses, arithmetic operators, and comma are all handled here. If a character doesn't match anything, it's silently skipped.

## Helper Functions

```typescript
// lib/language/lexer.ts
function isDigit(ch: string): boolean {
  return ch >= "0" && ch <= "9";
}

function isAlpha(ch: string): boolean {
  return (ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z");
}

function isAlphaNumeric(ch: string): boolean {
  return isDigit(ch) || isAlpha(ch);
}
```

Three small helpers that test character ranges. No regex, no external dependencies, just ASCII range checks. `isAlphaNumeric` is used by the identifier reader, `isDigit` by the number reader.

## Example

Running `tokenize("val x = 10")` produces:

```
[
  { type: Let,        value: "val", line: 1, col: 1 },
  { type: Identifier, value: "x",   line: 1, col: 5 },
  { type: Eq,         value: "=",   line: 1, col: 7 },
  { type: Number,     value: "10",  line: 1, col: 9 },
  { type: EOF,        value: "",    line: 1, col: 11 },
]
```

The lexer has no idea what a variable is. It just recognizes patterns and passes along a flat list of tokens. The parser turns that list into meaning.

In the [next part](/words/making-a-language-the-parser), we'll build the parser, the component that turns this flat token list into a structured tree.
