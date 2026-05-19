export enum TokenType {
  Number,
  String,
  Identifier,
  Let,
  If,
  Else,
  Fn,
  Return,
  Print,
  True,
  False,
  Nil,
  Plus,
  Minus,
  Star,
  Slash,
  Percent,
  Eq,
  EqEq,
  Bang,
  BangEq,
  Lt,
  Gt,
  LtEq,
  GtEq,
  LParen,
  RParen,
  LBrace,
  RBrace,
  LBracket,
  RBracket,
  Comma,
  Arrow,
  DotDot,
  EOF,
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  col: number;
}

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
    if (this.line <= 0 || this.col <= 0) return this.message;
    const lines = source.split("\n");
    const lineStr = lines[this.line - 1] ?? "";
    const pointer = " ".repeat(Math.max(0, this.col - 1)) + "^";
    return `${this.message}\n  at ${this.line}:${this.col}\n  ${lineStr}\n  ${pointer}`;
  }

  short(): string {
    return `[${this.line}:${this.col}] ${this.message}`;
  }
}

export class ParseError extends SparkError {
  constructor(message: string, line: number, col: number) {
    super(message, line, col);
    this.name = "ParseError";
  }
}

export class RuntimeError extends SparkError {
  constructor(message: string, line: number, col: number) {
    super(message, line, col);
    this.name = "RuntimeError";
  }
}

export type Statement =
  | Program
  | LetStatement
  | IfStatement
  | FunctionDeclaration
  | ReturnStatement
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

export type Expression =
  | BinaryExpression
  | UnaryExpression
  | Identifier
  | NumberLiteral
  | StringLiteral
  | BoolLiteral
  | NilLiteral
  | ArrayLiteral
  | IndexExpression
  | IndexAssignment
  | CallExpression
  | Assignment;

export interface BinaryExpression {
  kind: "BinaryExpression";
  left: Expression;
  operator: string;
  right: Expression;
}

export interface UnaryExpression {
  kind: "UnaryExpression";
  operator: string;
  operand: Expression;
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

export interface NilLiteral {
  kind: "NilLiteral";
}

export interface ArrayLiteral {
  kind: "ArrayLiteral";
  elements: Expression[];
}

export interface IndexExpression {
  kind: "IndexExpression";
  array: Expression;
  index: Expression;
}

export interface IndexAssignment {
  kind: "IndexAssignment";
  array: Expression;
  index: Expression;
  value: Expression;
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

export type RuntimeValue =
  | { type: "number"; value: number }
  | { type: "string"; value: string }
  | { type: "boolean"; value: boolean }
  | { type: "array"; value: RuntimeValue[] }
  | {
      type: "function";
      name: string;
      params: string[];
      body: Statement[];
      closure: Environment;
    }
  | { type: "native"; name: string; fn: (args: RuntimeValue[]) => RuntimeValue }
  | { type: "null" };

export interface Environment {
  variables: Map<string, RuntimeValue>;
  parent: Environment | null;
}