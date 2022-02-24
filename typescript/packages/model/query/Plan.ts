import { Expression } from "./Expression";
import { Query } from "./Query";

export default class Plan {
  #source: Query;
  #expressions: Expression[];

  constructor(source: Query) {
    this.#source = source;
  }

  addExpression(expression?: Expression): this {
    if (!expression) {
      return this;
    }

    this.#expressions.push(expression);

    return this;
  }

  optimize() {
    throw new Error("unimplemented");
  }
}
