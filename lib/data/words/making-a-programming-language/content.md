Have you ever looked at a piece of code and wondered: how does the computer actually know what this means? I don't mean how it compiles or optimizes. I mean the very first step. How does text become instructions?

The core ideas are surprisingly simple. There are only a few pieces: a **lexer** that turns text into tokens, a **parser** that builds structure out of those tokens, and an **evaluator** that runs that structure. Everything else (variables, functions, conditionals, even types) is just patterns built on top.

In this series, we'll build a working programming language called **Spark** using TypeScript. By the end, you'll have an actual interpreter you can run code in, right here in your browser.

## Choosing a Syntax

Before writing any code, we need to decide what our language looks like. I wanted something that feels familiar but has its own character, not just another JavaScript clone.

Here's what Spark looks like:

```spark
val name = "Spark"
val version = 1
val features = ["lexer", "parser", "eval"]

when (version > 0) {
  say("ready to go")
}

func add(a, b) {
  return a + b
}

say(add(3, 4))
```

The design choices:
- **`val`** instead of `let` or `const` (borrowed from Kotlin and Swift)
- **`func`** instead of `fn` or `function` (explicit and readable)
- **`say`** instead of `print` (Spark speaks to you)
- **`when`** instead of `if` (reads more like natural language)
- **`yes`** and **`no`** instead of `true` and `false` (plain English)
- Curly braces for blocks, no semicolons, newlines separate statements

## The Pipeline

Every language interpreter follows the same pipeline:

```
source code → lexer → tokens → parser → AST → evaluator → output
```

An analogy: imagine explaining a recipe to someone. The **lexer** is like recognizing individual words. The **parser** is understanding the grammar ("chop the onions" is a verb+noun pair). The **evaluator** is actually performing the actions.

## Token Types

The lexer and parser communicate through tokens. Each token has a type, a string value, and a source position for error reporting:

```typescript
// lib/language/types.ts
export enum TokenType {
  Number, String, Identifier,
  Let, If, Else, Fn, Return, Print,
  True, False,
  Plus, Minus, Star, Slash,
  Eq, EqEq, Bang, BangEq,
  Lt, Gt, LtEq, GtEq,
  LParen, RParen, LBrace, RBrace,
  LBracket, RBracket,
  Comma, Arrow, DotDot,
  EOF,
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}
```

Every language construct becomes a `TokenType` enum member. The `line` and `col` fields let us report exactly where errors occur.

## Error Classes

When something goes wrong, we need to point the programmer to the exact location:

```typescript
// lib/language/types.ts
export class SparkError extends Error {
  line: number;
  col: number;

  constructor(message: string, line: number, col: number) {
    super(message);
    this.name = "SparkError";
    this.line = line;
    this.col = col;
  }

  format(source: string): string {
    const lines = source.split("\n");
    const lineStr = lines[this.line - 1] ?? "";
    const pointer = " ".repeat(Math.max(0, this.col - 1)) + "^";
    return `${this.message}\n  at ${this.line}:${this.col}\n  ${lineStr}\n  ${pointer}`;
  }
}

export class ParseError extends SparkError {}
export class RuntimeError extends SparkError {}
```

`SparkError` stores the position and can render a formatted message with a caret pointing at the problem. `ParseError` and `RuntimeError` extend it with no extra logic. They just carry different names so callers can distinguish syntax errors from runtime errors.

## Statement Nodes

A Spark program is a list of statements. Each statement node is a discriminated union with a `kind` field:

```typescript
// lib/language/types.ts
export type Statement =
  | Program | LetStatement | IfStatement
  | FunctionDeclaration | ReturnStatement
  | ExpressionStatement;

export interface Program {
  kind: "Program";
  body: Statement[];
}

export interface LetStatement {
  kind: "LetStatement";
  name: string;
  value: Expression;
}

export interface IfStatement {
  kind: "IfStatement";
  condition: Expression;
  consequent: Statement[];
  alternate: Statement[] | null;
}

export interface FunctionDeclaration {
  kind: "FunctionDeclaration";
  name: string;
  params: string[];
  body: Statement[];
}

export interface ReturnStatement {
  kind: "ReturnStatement";
  value: Expression | null;
}

export interface ExpressionStatement {
  kind: "ExpressionStatement";
  expression: Expression;
}
```

`Program` is the root node containing all top-level statements. `IfStatement` carries both branches, and `FunctionDeclaration` stores its parameters and body separately.

## Expression Nodes

Expressions produce values. They follow the same discriminated union pattern:

```typescript
// lib/language/types.ts
export type Expression =
  | BinaryExpression | Identifier
  | NumberLiteral | StringLiteral | BoolLiteral
  | ArrayLiteral | IndexExpression
  | CallExpression | Assignment;

export interface BinaryExpression {
  kind: "BinaryExpression";
  left: Expression;
  operator: string;
  right: Expression;
}

export interface Identifier {
  kind: "Identifier";
  name: string;
}

export interface NumberLiteral {
  kind: "NumberLiteral";
  value: number;
}

export interface StringLiteral {
  kind: "StringLiteral";
  value: string;
}

export interface BoolLiteral {
  kind: "BoolLiteral";
  value: boolean;
}

export interface ArrayLiteral {
  kind: "ArrayLiteral";
  elements: Expression[];
}
```

The `operator` field on `BinaryExpression` is a string like `"+"`, `"-"`, `"=="`, or `".."` for ranges. This keeps the parser simple: it just records the operator text and lets the evaluator decide what each operator means.

## Indexing, Calls, and Assignment

After an expression, you can index into it, call it, or assign to it:

```typescript
// lib/language/types.ts
export interface IndexExpression {
  kind: "IndexExpression";
  array: Expression;
  index: Expression;
}

export interface CallExpression {
  kind: "CallExpression";
  callee: Expression;
  args: Expression[];
}

export interface Assignment {
  kind: "Assignment";
  name: string;
  value: Expression;
}
```

These three node types handle `arr[0]`, `foo()`, and `x = 5` respectively. They're parsed as suffixes to an existing expression, which naturally handles chaining like `getArr()[0]`.

## Runtime Values

The evaluator doesn't work with AST nodes. It works with runtime values. Every value in Spark is one of these:

```typescript
// lib/language/types.ts
export type RuntimeValue =
  | { type: "number";  value: number }
  | { type: "string";  value: string }
  | { type: "boolean"; value: boolean }
  | { type: "array";   value: RuntimeValue[] }
  | { type: "function"; name: string; params: string[];
      body: Statement[]; closure: Environment }
  | { type: "native";  name: string;
      fn: (args: RuntimeValue[]) => RuntimeValue }
  | { type: "null" };
```

Functions are first-class values. A user-defined function stores its AST (`body`), parameters (`params`), and the scope where it was defined (`closure`). Native functions are TypeScript callbacks. `say` is implemented this way.

## Environments

Variables live in environments, which form a linked list for lexical scoping:

```typescript
// lib/language/types.ts
export interface Environment {
  variables: Map<string, RuntimeValue>;
  parent: Environment | null;
}
```

When you reference a variable, the evaluator checks the current scope, then walks up through parents. A function's `closure` is the environment at the point of definition. That is what makes closures work.

With the types in place, we're ready to build the first stage of the pipeline. In the [next part](/words/making-a-language-the-lexer), we'll write the lexer, the component that turns raw text into a stream of tokens.
