In the [previous part](/words/making-a-language-the-lexer), we built the lexer that turns source code into a flat list of tokens. Now we need to give those tokens structure.

The parser takes the token list and builds an **Abstract Syntax Tree (AST)**, a tree representation of the program's grammar. I use **recursive descent parsing** with **precedence climbing** for expressions. Each grammar rule becomes a function, making the code map directly to the language spec.

## Entry Point

```typescript
// lib/language/parser.ts
export function parse(tokens: Token[]): Program {
  const p = new Parser(tokens);
  const body: Statement[] = [];

  while (!p.atEnd()) {
    const stmt = p.parseStatement();
    if (stmt) body.push(stmt);
  }

  return { kind: "Program", body };
}
```

The entry point creates a `Parser` instance, then loops through every token calling `parseStatement()`. Each call consumes tokens and returns an AST node. The result is a `Program` node containing the flat list of top-level statements.

## Parser Helpers

```typescript
// lib/language/parser.ts
private peek(): Token {
  return this.tokens[this.pos];
}

private previous(): Token {
  return this.tokens[this.pos - 1];
}

public atEnd(): boolean {
  return this.peek().type === TokenType.EOF;
}

private advance(): Token {
  if (!this.atEnd()) this.pos++;
  return this.previous();
}

private check(type: TokenType): boolean {
  if (this.atEnd()) return false;
  return this.peek().type === type;
}

private match(...types: TokenType[]): Token | null {
  for (const type of types) {
    if (this.check(type)) {
      return this.advance();
    }
  }
  return null;
}

private consume(type: TokenType, message: string): Token {
  if (this.check(type)) return this.advance();
  const t = this.peek();
  throw new ParseError(`${message}, got "${t.value}"`, t.line, t.col);
}
```

These are the primitives every recursive descent parser needs. `match` checks the current token against expected types and advances if it matches, returning `null` otherwise. `consume` does the same but throws a `ParseError` with the exact line and column. That is how the parser generates human-readable error messages.

## Statement Dispatch

```typescript
// lib/language/parser.ts
public parseStatement(): Statement | null {
  if (this.match(TokenType.Let)) return this.parseLet();
  if (this.match(TokenType.If)) return this.parseIf();
  if (this.match(TokenType.Fn)) return this.parseFunction();
  if (this.match(TokenType.Return)) return this.parseReturn();
  if (this.match(TokenType.Print)) return this.parsePrint();
  if (this.atEnd()) return null;
  return this.parseExpressionStatement();
}
```

`parseStatement` looks at the current token and dispatches to the right sub-parser. The key insight is that `match` both checks *and* consumes the keyword token, so by the time `parseLet` runs the `val` keyword is already consumed and the parser is positioned at the variable name.

## Parsing Each Statement

```typescript
// lib/language/parser.ts
private parseLet(): LetStatement {
  const name = this.consume(
    TokenType.Identifier,
    "Expected variable name after val",
  );
  this.consume(TokenType.Eq, "Expected '=' after variable name");
  const value = this.parseExpression(0);
  return { kind: "LetStatement", name: name.value, value };
}
```

`parseLet` consumes the variable name and `=`, then delegates to `parseExpression` for the value. It returns a `LetStatement` node with the name and initializer expression.

```typescript
// lib/language/parser.ts
private parseIf(): IfStatement {
  this.consume(TokenType.LParen, "Expected '(' after when");
  const condition = this.parseExpression(0);
  this.consume(TokenType.RParen, "Expected ')' after when condition");
  this.consume(TokenType.LBrace, "Expected '{' before when body");
  const consequent = this.parseBlock();
  let alternate: Statement[] | null = null;
  if (this.match(TokenType.Else)) {
    if (this.match(TokenType.If)) {
      const inner = this.parseIf();
      alternate = [inner];
    } else {
      this.consume(TokenType.LBrace, "Expected '{' after else");
      alternate = this.parseBlock();
    }
  }
  return { kind: "IfStatement", condition, consequent, alternate };
}
```

`parseIf` handles the full `when (cond) { ... } else { ... }` grammar. The `else when` case is handled by recursively calling `parseIf`. This gives us chainable else-if without any special syntax. The block bodies are parsed by `parseBlock`, which collects statements until it hits a closing `}`.

```typescript
// lib/language/parser.ts
private parseFunction(): FunctionDeclaration {
  const name = this.consume(
    TokenType.Identifier,
    "Expected function name after func",
  );
  this.consume(TokenType.LParen, "Expected '(' after function name");
  const params: string[] = [];
  if (!this.check(TokenType.RParen)) {
    params.push(
      this.consume(TokenType.Identifier, "Expected parameter name").value,
    );
    while (this.match(TokenType.Comma)) {
      params.push(
        this.consume(TokenType.Identifier, "Expected parameter name").value,
      );
    }
  }
  this.consume(TokenType.RParen, "Expected ')' after parameters");
  this.consume(TokenType.LBrace, "Expected '{' before function body");
  const body = this.parseBlock();
  return { kind: "FunctionDeclaration", name: name.value, params, body };
}
```

Functions follow the standard pattern: name, parenthesized parameter list (wrapped in a comma loop), then a block body. Parameter names are collected as strings. Type annotations could be added here later by consuming a `:` and a type token after each parameter name.

## Expression Parsing (Precedence Climbing)

```typescript
// lib/language/parser.ts
private parseExpression(precedence: number): Expression {
  let left = this.parsePrefix();

  while (!this.atEnd() && precedence < this.getPrecedence(this.peek().type)) {
    const op = this.advance().value;
    const right = this.parseExpression(this.getPrecedenceFromOp(op));
    left = {
      kind: "BinaryExpression",
      left,
      operator: op,
      right,
    } as BinaryExpression;
  }

  return left;
}
```

This is the core of the **precedence climbing** (or Pratt parsing) approach. It starts by parsing a prefix expression (literal, variable, parenthesized expression, unary operator), then loops: while the *next* operator has higher precedence than the current minimum, it consumes the operator and recursively parses the right operand with a higher minimum precedence. This is what makes `3 + 4 * 2` parse as `3 + (4 * 2)`. When parsing `4 * 2`, the `*` has precedence 5 which is higher than `+`'s 4, so the loop continues and groups them together.

```typescript
// lib/language/parser.ts
private parsePrefix(): Expression {
  if (this.match(TokenType.Number)) {
    return {
      kind: "NumberLiteral",
      value: parseFloat(this.previous().value),
    } as NumberLiteral;
  }
  if (this.match(TokenType.String)) {
    return {
      kind: "StringLiteral",
      value: this.previous().value,
    } as StringLiteral;
  }
  if (this.match(TokenType.True)) {
    return { kind: "BoolLiteral", value: true } as BoolLiteral;
  }
  if (this.match(TokenType.False)) {
    return { kind: "BoolLiteral", value: false } as BoolLiteral;
  }
  if (this.match(TokenType.LParen)) {
    const expr = this.parseExpression(0);
    this.consume(TokenType.RParen, "Expected ')' after expression");
    return expr;
  }
  if (this.match(TokenType.LBracket)) {
    return this.parseArray();
  }
  if (this.match(TokenType.Minus)) {
    const right = this.parseExpression(10);
    return {
      kind: "BinaryExpression",
      left: { kind: "NumberLiteral", value: 0 } as NumberLiteral,
      operator: "-",
      right,
    } as BinaryExpression;
  }
  if (this.match(TokenType.Bang)) {
    const right = this.parseExpression(10);
    return {
      kind: "BinaryExpression",
      left: right,
      operator: "!",
      right: { kind: "BoolLiteral", value: false } as BoolLiteral,
    } as unknown as Expression;
  }

  if (this.match(TokenType.Identifier)) {
    const name = this.previous().value;
    return this.parseIdentifierSuffix({
      kind: "Identifier",
      name,
    } as Identifier);
  }

  const t = this.peek();
  throw new ParseError(`Unexpected token "${t.value}"`, t.line, t.col);
}
```

`parsePrefix` handles every expression that can appear on the left side of an operator. Literals (numbers, strings, booleans) and parenthesized sub-expressions are straightforward. Unary `-` and `!` are desugared into binary expressions: negation becomes `0 - x`, and logical not becomes `x != true`. Identifiers are passed to `parseIdentifierSuffix` to handle chaining.

```typescript
// lib/language/parser.ts
private parseIdentifierSuffix(left: Expression): Expression {
  if (this.match(TokenType.Eq)) {
    if (left.kind !== "Identifier") {
      const t = this.previous();
      throw new ParseError("Cannot assign to non-identifier", t.line, t.col);
    }
    const value = this.parseExpression(0);
    return {
      kind: "Assignment",
      name: (left as Identifier).name,
      value,
    } as Assignment;
  }
  if (this.check(TokenType.LParen)) {
    return this.parseCallSuffix(left);
  }
  if (this.check(TokenType.LBracket)) {
    return this.parseIndexSuffix(left);
  }
  return left;
}

private parseCallSuffix(callee: Expression): Expression {
  this.advance();
  const args: Expression[] = [];
  if (!this.check(TokenType.RParen)) {
    args.push(this.parseExpression(0));
    while (this.match(TokenType.Comma)) {
      args.push(this.parseExpression(0));
    }
  }
  this.consume(TokenType.RParen, "Expected ')' after arguments");
  const expr: Expression = { kind: "CallExpression", callee, args };
  if (this.check(TokenType.LParen)) return this.parseCallSuffix(expr);
  if (this.check(TokenType.LBracket)) return this.parseIndexSuffix(expr);
  return expr;
}

private parseIndexSuffix(array: Expression): Expression {
  this.advance();
  const index = this.parseExpression(0);
  this.consume(TokenType.RBracket, "Expected ']' after index");
  const expr: Expression = { kind: "IndexExpression", array, index };
  if (this.check(TokenType.LParen)) return this.parseCallSuffix(expr);
  if (this.check(TokenType.LBracket)) return this.parseIndexSuffix(expr);
  return expr;
}
```

`parseIdentifierSuffix` handles the three things you can do after a name: assign to it (`x = 5`), call it (`foo()`), or index it (`arr[0]`). The call and index suffix methods are also the mechanism for **chaining**. `foo()[0].bar()` parses correctly because each suffix method checks if another `.()` or `[]` follows and recursively wraps the result.

## Precedence Table

```typescript
// lib/language/parser.ts
private getPrecedence(type: TokenType): number {
  switch (type) {
    case TokenType.DotDot:
      return 1;
    case TokenType.EqEq:
    case TokenType.BangEq:
      return 2;
    case TokenType.Lt:
    case TokenType.Gt:
    case TokenType.LtEq:
    case TokenType.GtEq:
      return 3;
    case TokenType.Plus:
    case TokenType.Minus:
      return 4;
    case TokenType.Star:
    case TokenType.Slash:
      return 5;
    case TokenType.LParen:
    case TokenType.LBracket:
      return 7;
    default:
      return 0;
  }
}

private getPrecedenceFromOp(op: string): number {
  const map: Record<string, number> = {
    "..": 1,
    "==": 2,
    "!=": 2,
    "<": 3,
    ">": 3,
    "<=": 3,
    ">=": 3,
    "+": 4,
    "-": 4,
    "*": 5,
    "/": 5,
  };
  return map[op] ?? 0;
}
```

The precedence table is split into two lookup methods. `getPrecedence` maps token types (used by `parseExpression` to decide whether to loop) and `getPrecedenceFromOp` maps operator strings (used to determine the minimum precedence for the right operand). Both use the same numeric values, with call/bracket at 7 acting as the highest binding power.

| Operators | Precedence |
|-----------|-----------|
| `..`      | 1 (range) |
| `==` `!=` | 2 (comparison) |
| `<` `>` `<=` `>=` | 3 (relational) |
| `+` `-` | 4 (addition) |
| `*` `/` | 5 (multiplication) |
| `()` `[]` | 7 (call/index) |

In the [next part](/words/making-a-language-the-evaluator), we'll build the evaluator, the component that actually walks the AST and produces output.
