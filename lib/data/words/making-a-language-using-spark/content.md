In the [previous part](/words/making-a-language-the-evaluator), we built the evaluator. Now let's tie everything together.

## The Public API

```typescript
// lib/language/index.ts
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
```

`run` chains lexer to parser to evaluator. If a `ParseError` or `RuntimeError` is thrown, `run` catches it and formats the error with source context, showing the line and a pointer to the exact position.

```typescript
// lib/language/index.ts
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
```

Each stage is also exported separately so the playground can use them independently for debugging or step-by-step execution.

## Examples

### Grade Calculator

```
func average(nums) {
  val sum = nums[0] + nums[1] + nums[2]
  return sum / 3
}

val scores = [85, 92, 78]
say("average:", average(scores))

when (average(scores) >= 90) {
  say("grade: A")
} else when (average(scores) >= 80) {
  say("grade: B")
} else {
  say("grade: C")
}
```

Demonstrates arrays, function calls, and `else when` chaining.

### String Utilities

```
func greet(name) {
  return "hello " + name + "!"
}

say(greet("alice"))

func repeat(s, n) {
  when (n <= 1) {
    return s
  }
  return s + repeat(s, n - 1)
}

say(repeat("ha", 3))
```

Shows string concatenation and recursion. `repeat` calls itself until `n` reaches 1.

### Todo Tracker

```
val todos = []

func add(text) {
  todos = todos + [text]
}

add("write lexer")
add("write parser")
add("write evaluator")

say("todos:")
say(todos[0])
say(todos[1])
say(todos[2])
```

Uses the array `+` operator to append, and assignment to mutate a top-level variable.

### Fibonacci

```
func fib(n) {
  when (n <= 1) {
    return n
  }
  return fib(n - 1) + fib(n - 2)
}

say("fib(10) =", fib(10))
```

Two-branch recursion: each call spawns two more until the base case.

### Logical Operators

```
val age = 17
val has_permission = yes

when (age >= 18 and has_permission) {
  say("access granted")
} else {
  say("access denied")
}

say("0 and 5:", 0 and 5)
say("3 and 5:", 3 and 5)
say("0 or 5:", 0 or 5)
say("3 or 5:", 3 or 5)
```

`and` and `or` use short-circuit evaluation. `0 and 5` returns `0` (falsy, so `5` is never evaluated). `3 or 5` returns `3` (truthy, short-circuits). This lets you write concise condition checks.

### FizzBuzz

```
func fizzbuzz(n) {
  when (n == 0) {
    return
  }
  when (n % 15 == 0) {
    say("fizzbuzz")
  } else when (n % 3 == 0) {
    say("fizz")
  } else when (n % 5 == 0) {
    say("buzz")
  } else {
    say(n)
  }
  fizzbuzz(n - 1)
}

say(fizzbuzz(100))
```

Uses modulo and `else when` to check conditions in priority order.

## Your Turn: Add Loops

I left loops out of Spark on purpose. Adding them is the best way to understand how all three layers fit together. You need one small change in each file:

**Lexer**. Add `loop` to the keywords map and `Loop` to the token enum:

```typescript
// lib/language/lexer.ts
const KEYWORDS = {
  // ... existing keywords ...
  loop: TokenType.Loop,
};
```

```typescript
// lib/language/types.ts
export enum TokenType {
  // ... existing tokens ...
  Loop,
}
```

**Parser**. Add a `WhileStatement` case. Check for the `loop` token, then parse the condition and body:

```typescript
// lib/language/parser.ts
// In parseStatement(), add before the atEnd check:
if (this.match(TokenType.Loop)) return this.parseWhile();

// New method:
private parseWhile(): Statement {
  this.consume(TokenType.LParen, "Expected '(' after loop");
  const condition = this.parseExpression(0);
  this.consume(TokenType.RParen, "Expected ')' after loop condition");
  this.consume(TokenType.LBrace, "Expected '{' before loop body");
  const body = this.parseBlock();
  return { kind: "WhileStatement", condition, body };
}
```

Also add `WhileStatement` to the `Statement` type union in `types.ts`.

**Evaluator**. One small case in the statement switch:

```typescript
// lib/language/evaluator.ts
case "WhileStatement":
  while (isTruthy(evaluateExpression(stmt.condition, env))) {
    evaluateBlock(stmt.body, env);
  }
  return { type: "null" };
```

Put it together and now Spark has loops:

```
val i = 0
loop (i < 5) {
  say(i)
  i = i + 1
}
```

That's all it takes. Every feature follows the same recipe: a token in the lexer, a node in the parser, and a handler in the evaluator. Spark's `and` and `or` operators were added exactly this way — two new token types, two precedence entries, and two short-circuit evaluations.

Try it yourself. Break things. Change the syntax. Add features. Now that you know how the pieces fit together, you're not just a language user. You're a language designer.

The full source code for Spark is available on [GitHub](https://github.com/Cinnamonsroll/Portfolio/tree/main/lib/language).
