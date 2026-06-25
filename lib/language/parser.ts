import {
  TokenType,
  type Token,
  type Statement,
  type Program,
  type Expression,
  type LetStatement,
  type IfStatement,
  type FunctionDeclaration,
  type ReturnStatement,
  type ExpressionStatement,
  type BinaryExpression,
  type UnaryExpression,
  type Identifier,
  type NumberLiteral,
  type StringLiteral,
  type BoolLiteral,
  type NilLiteral,
  type ArrayLiteral,
  type IndexExpression,
  type IndexAssignment,
  type CallExpression,
  type Assignment,
  ParseError,
} from "./types";

export function parse(tokens: Token[]): Program {
  const p = new Parser(tokens);
  const body: Statement[] = [];

  while (!p.atEnd()) {
    const stmt = p.parseStatement();
    if (stmt) body.push(stmt);
  }

  return { kind: "Program", body };
}

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

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

  public parseStatement(): Statement | null {
    if (this.match(TokenType.Let)) return this.parseLet();
    if (this.match(TokenType.If)) return this.parseIf();
    if (this.match(TokenType.Fn)) return this.parseFunction();
    if (this.match(TokenType.Return)) return this.parseReturn();
    if (this.match(TokenType.Print)) return this.parsePrint();
    if (this.atEnd()) return null;
    return this.parseExpressionStatement();
  }

  private parseLet(): LetStatement {
    const name = this.consume(
      TokenType.Identifier,
      "Expected variable name after val",
    );
    this.consume(TokenType.Eq, "Expected '=' after variable name");
    const value = this.parseExpression(0);
    return { kind: "LetStatement", name: name.value, value };
  }

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

  private parseReturn(): ReturnStatement {
    if (this.check(TokenType.RBrace) || this.atEnd()) {
      return { kind: "ReturnStatement", value: null };
    }
    const value = this.parseExpression(0);
    return { kind: "ReturnStatement", value };
  }

  private parsePrint(): ExpressionStatement {
    const value = this.parseExpression(0);
    return {
      kind: "ExpressionStatement",
      expression: {
        kind: "CallExpression",
        callee: { kind: "Identifier", name: "say" },
        args: [value],
      } as CallExpression,
    };
  }

  private parseBlock(): Statement[] {
    const statements: Statement[] = [];
    while (!this.check(TokenType.RBrace) && !this.atEnd()) {
      const stmt = this.parseStatement();
      if (stmt) statements.push(stmt);
    }
    this.consume(TokenType.RBrace, "Expected '}' at end of block");
    return statements;
  }

  private parseExpressionStatement(): ExpressionStatement {
    const expr = this.parseExpression(0);
    return { kind: "ExpressionStatement", expression: expr };
  }

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

    if (this.match(TokenType.Eq)) {
      const value = this.parseExpression(0);
      if (left.kind === "Identifier") {
        return { kind: "Assignment", name: (left as Identifier).name, value } as Assignment;
      }
      if (left.kind === "IndexExpression") {
        const ie = left as IndexExpression;
        return { kind: "IndexAssignment", array: ie.array, index: ie.index, value } as IndexAssignment;
      }
      const t = this.previous();
      throw new ParseError("Cannot assign to non-identifier", t.line, t.col);
    }

    return left;
  }

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
    if (this.match(TokenType.Nil)) {
      return { kind: "NilLiteral" } as NilLiteral;
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
      const operand = this.parseExpression(10);
      return { kind: "UnaryExpression", operator: "not", operand } as UnaryExpression;
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

  private parseIdentifierSuffix(left: Expression): Expression {
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

  private parseArray(): ArrayLiteral {
    const elements: Expression[] = [];
    if (!this.check(TokenType.RBracket)) {
      elements.push(this.parseExpression(0));
      while (this.match(TokenType.Comma)) {
        if (this.check(TokenType.RBracket)) break;
        elements.push(this.parseExpression(0));
      }
    }
    this.consume(TokenType.RBracket, "Expected ']' after array elements");
    return { kind: "ArrayLiteral", elements };
  }

  private getPrecedence(type: TokenType): number {
    switch (type) {
      case TokenType.Or:
        return 1;
      case TokenType.And:
      case TokenType.DotDot:
        return 2;
      case TokenType.EqEq:
      case TokenType.BangEq:
        return 3;
      case TokenType.Lt:
      case TokenType.Gt:
      case TokenType.LtEq:
      case TokenType.GtEq:
        return 4;
      case TokenType.Plus:
      case TokenType.Minus:
        return 5;
      case TokenType.Star:
      case TokenType.Slash:
      case TokenType.Percent:
        return 6;
      case TokenType.LParen:
      case TokenType.LBracket:
        return 8;
      default:
        return 0;
    }
  }

  private getPrecedenceFromOp(op: string): number {
    const map: Record<string, number> = {
      "or": 1,
      "and": 2,
      "..": 2,
      "==": 3,
      "!=": 3,
      "<": 4,
      ">": 4,
      "<=": 4,
      ">=": 4,
      "+": 5,
      "-": 5,
      "*": 6,
      "/": 6,
      "%": 6,
    };
    return map[op] ?? 0;
  }
}