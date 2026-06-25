import type {
  Statement,
  Expression,
  Program,
  LetStatement,
  IfStatement,
  FunctionDeclaration,
  BinaryExpression,
  ArrayLiteral,
  IndexExpression,
  CallExpression,
  Assignment,
} from "./types";
import type { UnaryExpression, IndexAssignment } from "./types";
import {
  RuntimeError, type RuntimeValue, type Environment
} from "./types";
import { createEnvironment, defineVar, getVar, setVar } from "./environment";

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
    const body = program.body;
    for (let i = 0; i < body.length; i++) {
      evaluateStatement(body[i], env);
    }
  } catch (e) {
    if (e instanceof RuntimeError) {
      return { output, error: e.format(originalSource) };
    }
    throw e;
  }

  return { output };
}

let originalSource = "";

export function setSource(source: string) {
  originalSource = source;
}

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

function evaluateLet(stmt: LetStatement, env: Environment): RuntimeValue {
  const value = evaluateExpression(stmt.value, env);
  return defineVar(env, stmt.name, value);
}

function evaluateIf(stmt: IfStatement, env: Environment): RuntimeValue {
  const boolVal = isTruthy(evaluateExpression(stmt.condition, env));

  if (boolVal) {
    return evaluateBlock(stmt.consequent, env);
  }
  if (stmt.alternate) {
    if (stmt.alternate.length === 1 && stmt.alternate[0].kind === "IfStatement") {
      return evaluateIf(stmt.alternate[0] as IfStatement, env);
    }
    return evaluateBlock(stmt.alternate, env);
  }

  return { type: "null" };
}

function evaluateFn(stmt: FunctionDeclaration, env: Environment): RuntimeValue {
  const fn: RuntimeValue = {
    type: "function",
    name: stmt.name,
    params: stmt.params,
    body: stmt.body,
    closure: env,
  };
  return defineVar(env, stmt.name, fn);
}

function evaluateBlock(stmts: Statement[], env: Environment): RuntimeValue {
  const blockEnv = createEnvironment(env);
  let result: RuntimeValue = { type: "null" };
  for (let i = 0; i < stmts.length; i++) {
    result = evaluateStatement(stmts[i], blockEnv);
  }
  return result;
}

class ReturnSignal {
  constructor(public value: RuntimeValue) {}
}

function evaluateExpression(expr: Expression, env: Environment): RuntimeValue {
  switch (expr.kind) {
    case "NumberLiteral":
      return { type: "number", value: expr.value };
    case "StringLiteral":
      return { type: "string", value: expr.value };
    case "BoolLiteral":
      return { type: "boolean", value: expr.value };
    case "NilLiteral":
      return { type: "null" };
    case "Identifier":
      return getVar(env, expr.name, 0, 0);
    case "BinaryExpression":
      return evaluateBinary(expr, env);
    case "UnaryExpression":
      return evaluateUnary(expr, env);
    case "ArrayLiteral":
      return evaluateArray(expr, env);
    case "IndexExpression":
      return evaluateIndex(expr, env);
    case "IndexAssignment":
      return evaluateIndexAssignment(expr, env);
    case "CallExpression":
      return evaluateCall(expr, env);
    case "Assignment":
      return evaluateAssignment(expr, env);
    default:
      return { type: "null" };
  }
}

function evaluateExpressionOrNull(
  expr: Expression | null,
  env: Environment,
): RuntimeValue {
  if (!expr) return { type: "null" };
  return evaluateExpression(expr, env);
}

function evaluateBinary(
  expr: BinaryExpression,
  env: Environment,
): RuntimeValue {
  if (expr.operator === "and") {
    const left = evaluateExpression(expr.left, env);
    if (!isTruthy(left)) return left;
    return evaluateExpression(expr.right, env);
  }
  if (expr.operator === "or") {
    const left = evaluateExpression(expr.left, env);
    if (isTruthy(left)) return left;
    return evaluateExpression(expr.right, env);
  }

  const left = evaluateExpression(expr.left, env);
  const right = evaluateExpression(expr.right, env);

  switch (expr.operator) {
    case "..":
      if (left.type === "number" && right.type === "number") {
        const arr: RuntimeValue[] = [];
        for (let i = left.value; i <= right.value; i++) {
          arr.push({ type: "number", value: i });
        }
        return { type: "array", value: arr };
      }
      throw new RuntimeError("Range requires numbers", 0, 0);
    case "+": {
      if (left.type === "number" && right.type === "number")
        return { type: "number", value: left.value + right.value };
      if (left.type === "string" && right.type === "string")
        return { type: "string", value: left.value + right.value };
      if (left.type === "array" && right.type === "array")
        return { type: "array", value: [...left.value, ...right.value] };
      return { type: "string", value: formatValue(left) + formatValue(right) };
    }
    case "-":
      if (left.type === "number" && right.type === "number")
        return { type: "number", value: left.value - right.value };
      throw new RuntimeError("Subtraction requires numbers", 0, 0);
    case "*":
      if (left.type === "number" && right.type === "number")
        return { type: "number", value: left.value * right.value };
      throw new RuntimeError("Multiplication requires numbers", 0, 0);
    case "/":
      if (left.type === "number" && right.type === "number") {
        if (right.value === 0) throw new RuntimeError("Division by zero", 0, 0);
        return { type: "number", value: left.value / right.value };
      }
      throw new RuntimeError("Division requires numbers", 0, 0);
    case "%":
      if (left.type === "number" && right.type === "number") {
        if (right.value === 0) throw new RuntimeError("Division by zero", 0, 0);
        return { type: "number", value: left.value % right.value };
      }
      throw new RuntimeError("Modulo requires numbers", 0, 0);
    case "==":
      return { type: "boolean", value: valuesEqual(left, right) };
    case "!=":
      return { type: "boolean", value: !valuesEqual(left, right) };
    case "<":
      if (left.type === "number" && right.type === "number")
        return { type: "boolean", value: left.value < right.value };
      throw new RuntimeError("Comparison requires numbers", 0, 0);
    case ">":
      if (left.type === "number" && right.type === "number")
        return { type: "boolean", value: left.value > right.value };
      throw new RuntimeError("Comparison requires numbers", 0, 0);
    case "<=":
      if (left.type === "number" && right.type === "number")
        return { type: "boolean", value: left.value <= right.value };
      throw new RuntimeError("Comparison requires numbers", 0, 0);
    case ">=":
      if (left.type === "number" && right.type === "number")
        return { type: "boolean", value: left.value >= right.value };
      throw new RuntimeError("Comparison requires numbers", 0, 0);
    default:
      throw new RuntimeError(`Unknown operator "${expr.operator}"`, 0, 0);
  }
}

function evaluateUnary(
  expr: UnaryExpression,
  env: Environment,
): RuntimeValue {
  const operand = evaluateExpression(expr.operand, env);
  return { type: "boolean", value: !isTruthy(operand) };
}

function evaluateArray(expr: ArrayLiteral, env: Environment): RuntimeValue {
  const el = expr.elements;
  const n = el.length;
  const elements = new Array(n);
  for (let i = 0; i < n; i++) {
    elements[i] = evaluateExpression(el[i], env);
  }
  return { type: "array", value: elements };
}

function evaluateIndex(expr: IndexExpression, env: Environment): RuntimeValue {
  const array = evaluateExpression(expr.array, env);
  const index = evaluateExpression(expr.index, env);
  if (array.type !== "array")
    throw new RuntimeError("Indexing requires an array", 0, 0);
  if (index.type !== "number")
    throw new RuntimeError("Index must be a number", 0, 0);
  const idx = index.value;
  if (idx < 0 || idx >= array.value.length)
    throw new RuntimeError(
      `Index ${idx} out of bounds for array of length ${array.value.length}`,
      0,
      0,
    );
  return array.value[idx];
}

function evaluateIndexAssignment(
  expr: IndexAssignment,
  env: Environment,
): RuntimeValue {
  const array = evaluateExpression(expr.array, env);
  const index = evaluateExpression(expr.index, env);
  const value = evaluateExpression(expr.value, env);
  if (array.type !== "array")
    throw new RuntimeError("Indexing requires an array", 0, 0);
  if (index.type !== "number")
    throw new RuntimeError("Index must be a number", 0, 0);
  const idx = index.value;
  if (idx < 0 || idx >= array.value.length)
    throw new RuntimeError(
      `Index ${idx} out of bounds for array of length ${array.value.length}`,
      0,
      0,
    );
  array.value[idx] = value;
  return value;
}

function evaluateCall(expr: CallExpression, env: Environment): RuntimeValue {
  const callee = evaluateExpression(expr.callee, env);
  const args = expr.args.map((a) => evaluateExpression(a, env));

  if (callee.type === "native") {
    return callee.fn(args);
  }

  if (callee.type === "function") {
    const fnEnv = createEnvironment(callee.closure);
    const params = callee.params;
    for (let i = 0; i < params.length; i++) {
      defineVar(fnEnv, params[i], args[i] ?? { type: "null" });
    }
    try {
      return evaluateBlock(callee.body, fnEnv);
    } catch (e) {
      if (e instanceof ReturnSignal) return e.value;
      throw e;
    }
  }

  throw new RuntimeError("Cannot call non-function", 0, 0);
}

function evaluateAssignment(expr: Assignment, env: Environment): RuntimeValue {
  const value = evaluateExpression(expr.value, env);
  return setVar(env, expr.name, value, 0, 0);
}

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

function valuesEqual(a: RuntimeValue, b: RuntimeValue): boolean {
  if (a.type !== b.type) return false;
  switch (a.type) {
    case "number":
      return a.value === (b as typeof a).value;
    case "string":
      return a.value === (b as typeof a).value;
    case "boolean":
      return a.value === (b as typeof a).value;
    case "null":
      return true;
    case "array":
      return (
        a.value.length === (b as typeof a).value.length &&
        a.value.every((v, i) => valuesEqual(v, (b as typeof a).value[i]))
      );
    default:
      return false;
  }
}

export function formatValue(val: RuntimeValue): string {
  switch (val.type) {
    case "null":
      return "nil";
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