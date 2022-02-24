import { after, before, Expression, first, last } from "./Expression";
import Plan from "./Plan";

export interface Query {
  readonly priorQuery?: Query;
  readonly expression?: Expression;

  plan(): Plan;
}

export abstract class BaseQuery implements Query {
  // source query
  // expression
  // make a recursive data structure of queries and expressions.
  // then convert to plan which will collapse expression as needed.
  // How do expressions convert themselves to SQL or whatever?
  constructor(
    public readonly priorQuery?: Query,
    public readonly expression?: Expression
  ) {}

  // Expression could be null if we're hopping an edge?
  // That'd just be a change in query type rather than an expression?
  abstract new(priorQuery: Query, expression: Expression): this;

  first(n: number): this {
    return this.new(this, first(n));
  }

  last(n: number): this {
    return this.new(this, last(n));
  }

  after(c: string): this {
    return this.new(this, after(c));
  }

  before(c: string): this {
    return this.new(this, before(c));
  }

  plan() {
    if (this.priorQuery) {
      return this.priorQuery.plan().addExpression(this.expression);
    }

    return new Plan(this).addExpression(this.expression);
  }
}
