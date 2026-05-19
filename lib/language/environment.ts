import { RuntimeError, type Environment, type RuntimeValue } from "./types";

export function createEnvironment(
  parent: Environment | null = null,
): Environment {
  return { variables: new Map(), parent };
}

export function defineVar(
  env: Environment,
  name: string,
  value: RuntimeValue,
  line = 0,
  col = 0,
): RuntimeValue {
  if (env.variables.has(name)) {
    throw new RuntimeError(
      `"${name}" is already defined`,
      line,
      col,
    );
  }
  env.variables.set(name, value);
  return value;
}

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