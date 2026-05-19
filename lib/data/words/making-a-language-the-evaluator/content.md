In the [previous part](/words/making-a-language-the-parser), we built the parser that turns tokens into an AST. Now we get to the fun part: making it actually run.

## Environments: Managing Scope

Variables don't float in space. They live in **environments**. An environment is just a map of names to values, with a pointer to the parent scope.

```typescript
// lib/language/environment.ts

export function createEnvironment(
  parent: Environment | null = null,
): Environment {
  return { variables: new Map(), parent };
}
```

Creates a fresh scope. Pass a `parent` and the new environment links to it. Variable lookups will walk up that chain.

```typescript
// lib/language/environment.ts

export function defineVar(
  env: Environment,
  name: string,
  value: RuntimeValue,
): RuntimeValue {
  env.variables.set(name, value);
  return value;
}
```

Sticks a variable into the current environment. No chain-walking; `let` always binds in the innermost scope.

```typescript
// lib/language/environment.ts

export function getVar(
  env: Environment,
  name: string,
  line: number,
  col: number,
): RuntimeValue {
  let current: Environment | null = env;
  while (current) {
    const value = current.variables.get(name);
    if (value !== undefined) return value;
    current = current.parent;
  }
  throw new RuntimeError(`Undefined variable "${name}"`, line, col);
}
```

Walks up from the current environment through each parent until it finds the variable. If it reaches the top with no match, it throws a `RuntimeError` with source position. There is no silent `undefined` nonsense.

```typescript
// lib/language/environment.ts

export function setVar(
  env: Environment,
  name: string,
  value: RuntimeValue,
  line: number,
  col: number,
): RuntimeValue {
  let current: Environment | null = env;
  while (current) {
    if (current.variables.has(name)) {
      current.variables.set(name, value);
      return value;
    }
    current = current.parent;
  }
  throw new RuntimeError(`Undefined variable "${name}"`, line, col);
}
```

Same walk-up logic as `getVar`, but for reassignment. It only writes to the scope where the variable was originally defined. Shadows are respected, not overwritten.

## The evaluate Function

```typescript
// lib/language/evaluator.ts

export function evaluate(program: Program): {
  output: string[];
  error?: string;
} {
  const output: string[] = [];
  const env = createEnvironment();

  defineVar(env, "say", {
    type: "native",
    name: "say",
    fn: (args) => {
      const str = args.map(formatValue).join(" ");
      output.push(str);
      return { type: "null" };
    },
  });

  try {
    for (const stmt of program.body) {
      evaluateStatement(stmt, env);
    }
  } catch (e) {
    if (e instanceof RuntimeError) {
      return { output, error: e.format(originalSource) };
    }
    throw e;
  }

  return { output };
}
```

The entry point. It creates the global environment, registers the built-in `say` function (which captures `output` by closure), then runs every statement in the program. If any `RuntimeError` escapes, it's caught and formatted with source context so the process never hard-crashes.

```typescript
// lib/language/evaluator.ts

let originalSource = "";

export function setSource(source: string) {
  originalSource = source;
}
```

The parser calls `setSource` before evaluation so runtime errors can display the offending line with a pointer.

## Statement Evaluation

```typescript
// lib/language/evaluator.ts

function evaluateStatement(stmt: Statement, env: Environment): RuntimeValue {
  switch (stmt.kind) {
    case "LetStatement":
      return evaluateLet(stmt, env);
    case "IfStatement":
      return evaluateIf(stmt, env);
    case "FunctionDeclaration":
      return evaluateFn(stmt, env);
    case "ReturnStatement":
      throw new ReturnSignal(evaluateExpressionOrNull(stmt.value, env));
    case "ExpressionStatement":
      return evaluateExpression(stmt.expression, env);
    default:
      return { type: "null" };
  }
}
```

Dispatches on the AST node's `kind`. Each statement type has its own handler. `ReturnStatement` doesn't return. Instead it throws a signal that unwinds the call stack.

```typescript
// lib/language/evaluator.ts

function evaluateLet(stmt: LetStatement, env: Environment): RuntimeValue {
  const value = evaluateExpression(stmt.value, env);
  return defineVar(env, stmt.name, value);
}

function evaluateIf(stmt: IfStatement, env: Environment): RuntimeValue {
  const condition = evaluateExpression(stmt.condition, env);
  const boolVal = isTruthy(condition);

  if (boolVal) {
    return evaluateBlock(stmt.consequent, env);
  } else if (stmt.alternate) {
    if (
      stmt.alternate.length === 1 &&
      stmt.alternate[0].kind === "IfStatement"
    ) {
      return evaluateIf(stmt.alternate[0] as IfStatement, env);
    }
    return evaluateBlock(stmt.alternate, env);
  }

  return { type: "null" };
}

function evaluateFn(
  stmt: FunctionDeclaration,
  env: Environment,
): RuntimeValue {
  const fn: RuntimeValue = {
    type: "function",
    name: stmt.name,
    params: stmt.params,
    body: stmt.body,
    closure: env,
  };
  return defineVar(env, stmt.name, fn);
}
```

- **`evaluateLet`** evaluates the initializer and binds the result in the current scope.
- **`evaluateIf`** checks truthiness (not strict boolean), then runs the matching branch. `else if` chains are handled by checking if the alternate is a single `IfStatement` and recursing.
- **`evaluateFn`** creates a function object that captures the current environment as its `closure`. This is what enables lexical scoping.

```typescript
// lib/language/evaluator.ts

function evaluateBlock(stmts: Statement[], env: Environment): RuntimeValue {
  const blockEnv = createEnvironment(env);
  let result: RuntimeValue = { type: "null" };
  for (const stmt of stmts) {
    try {
      result = evaluateStatement(stmt, blockEnv);
    } catch (e) {
      if (e instanceof ReturnSignal) throw e;
      throw e;
    }
  }
  return result;
}

class ReturnSignal {
  constructor(public value: RuntimeValue) {}
}
```

A block creates a child scope and runs each statement in order. The `ReturnSignal` class is the mechanism for `return`. It is thrown by `ReturnStatement` and caught by the function call handler. `evaluateBlock` re-throws it so it propagates up through nested blocks.

## Expression Evaluation

```typescript
// lib/language/evaluator.ts

function evaluateExpression(expr: Expression, env: Environment): RuntimeValue {
  switch (expr.kind) {
    case "NumberLiteral":
      return { type: "number", value: expr.value };
    case "StringLiteral":
      return { type: "string", value: expr.value };
    case "BoolLiteral":
      return { type: "boolean", value: expr.value };
    case "Identifier":
      return getVar(env, expr.name, 0, 0);
    case "BinaryExpression":
      return evaluateBinary(expr, env);
    case "ArrayLiteral":
      return evaluateArray(expr, env);
    case "IndexExpression":
      return evaluateIndex(expr, env);
    case "CallExpression":
      return evaluateCall(expr, env);
    case "Assignment":
      return evaluateAssignment(expr, env);
    default:
      return { type: "null" };
  }
}
```

Literals become runtime values directly. Identifiers look up variables, binary expressions recurse into `evaluateBinary`, calls dispatch to `evaluateCall`, and so on. Same pattern as `evaluateStatement`: one handler per kind.

## Binary Operators

```typescript
// lib/language/evaluator.ts

function evaluateBinary(expr: BinaryExpression, env: Environment): RuntimeValue {
  if (expr.operator === "!") {
    const right = evaluateExpression(expr.right, env);
    return { type: "boolean", value: !isTruthy(right) };
  }
  // ...evaluate left/right, then switch on operator...
```

The `!` (not) operator is special. It is an example of unary in practice, stored as binary in the AST. It negates truthiness rather than requiring a boolean, so `!0` is `yes` and `![]` is `no`.

```typescript
// lib/language/evaluator.ts

    case "..":
      if (left.type === "number" && right.type === "number") {
        const arr: RuntimeValue[] = [];
        for (let i = left.value; i <= right.value; i++) {
          arr.push({ type: "number", value: i });
        }
        return { type: "array", value: arr };
      }
      throw new RuntimeError("Range requires numbers", 0, 0);
```

The range operator `..` (inspired by Rust) creates an array of consecutive numbers. `1..5` evaluates to `[1, 2, 3, 4, 5]`.

```typescript
// lib/language/evaluator.ts

    case "+": {
      if (left.type === "number" && right.type === "number")
        return { type: "number", value: left.value + right.value };
      if (left.type === "string" && right.type === "string")
        return { type: "string", value: left.value + right.value };
      if (left.type === "array" && right.type === "array")
        return { type: "array", value: [...left.value, ...right.value] };
      return { type: "string", value: formatValue(left) + formatValue(right) };
    }
```

The `+` operator is overloaded: adds numbers, concatenates strings, merges arrays, and coerces mixed types to strings. Other operators like `-`, `*`, `/`, and comparisons all enforce numeric types.

```typescript
// lib/language/evaluator.ts

function evaluateCall(expr: CallExpression, env: Environment): RuntimeValue {
  const callee = evaluateExpression(expr.callee, env);

  if (callee.type === "native") {
    const args = expr.args.map((a) => evaluateExpression(a, env));
    return callee.fn(args);
  }

  if (callee.type === "function") {
    const args = expr.args.map((a) => evaluateExpression(a, env));
    const fnEnv = createEnvironment(callee.closure);
    callee.params.forEach((param, i) => {
      defineVar(fnEnv, param, args[i] ?? { type: "null" });
    });
    try {
      return evaluateBlock(callee.body, fnEnv);
    } catch (e) {
      if (e instanceof ReturnSignal) return e.value;
      throw e;
    }
  }

  throw new RuntimeError("Cannot call non-function", 0, 0);
}
```

Native functions (like `say`) call directly into JavaScript. User-defined functions create a new environment chained to their closure (not the call site), bind arguments to parameter names, then run the body. The `try`/`catch` intercepts `ReturnSignal` to extract the return value.

## Truthiness and Equality

```typescript
// lib/language/evaluator.ts

function isTruthy(val: RuntimeValue): boolean {
  switch (val.type) {
    case "null":
      return false;
    case "boolean":
      return val.value;
    case "number":
      return val.value !== 0;
    case "string":
      return val.value !== "";
    case "array":
      return val.value.length > 0;
    default:
      return true;
  }
}
```

Zero, empty string, empty array, and `null` are falsy. Everything else, including functions, is truthy. This lets you write `when (items)` instead of `when (items.length > 0)`.

```typescript
// lib/language/evaluator.ts

export function formatValue(val: RuntimeValue): string {
  switch (val.type) {
    case "null":
      return "null";
    case "number":
      return String(val.value);
    case "string":
      return val.value;
    case "boolean":
      return val.value ? "yes" : "no";
    case "array":
      return `[${val.value.map(formatValue).join(", ")}]`;
    case "function":
      return `<func ${val.name}>`;
    case "native":
      return `<native ${val.name}>`;
  }
}
```

Controls how values appear in `say` output. Booleans display as `yes`/`no` instead of `true`/`false`. A small language personality choice. Arrays are recursively expanded.

In the [final part](/words/making-a-language-using-spark), we'll wire everything up, run some complete Spark programs, and explore how you can extend the language yourself.
