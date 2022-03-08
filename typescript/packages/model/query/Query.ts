import { DerivedExpression, SourceExpression } from "./Expression";
import Plan from "./Plan";

export interface Query<T> {
  plan(): Plan;
  gen(): Promise<T[]>;
}

abstract class BaseQuery<T> implements Query<T> {
  async gen(): Promise<T[]> {
    const plan = this.plan().optimize();

    let results: T[] = [];
    for await (const chunk of plan.iterable) {
      results = results.concat(chunk);
    }

    return results;
  }

  abstract plan(): Plan;
}

export abstract class SourceQuery<T> extends BaseQuery<T> {
  // source query
  // expression
  // make a recursive data structure of queries and expressions.
  // then convert to plan which will collapse expression as needed.
  // How do expressions convert themselves to SQL or whatever?
  constructor(public readonly expression: SourceExpression<T>) {
    super();
  }

  // Expression could be null if we're hopping an edge?
  // That'd just be a change in query type rather than an expression?
  // abstract new<TOut, Tq extends DerivedQuery<T, TOut>>(
  //   priorQuery: Query<T>,
  //   expression: Expression
  // ): Tq;

  plan() {
    return new Plan(this.expression, []);
  }
}

export abstract class DerivedQuery<TIn, TOut> extends BaseQuery<TOut> {
  #priorQuery: Query<TIn>;
  #expression?: DerivedExpression<TIn, TOut>;

  constructor(
    priorQuery: Query<TIn>,
    expression?: DerivedExpression<TIn, TOut>
  ) {
    super();
    this.#priorQuery = priorQuery;
    this.#expression = expression;
  }

  plan() {
    const plan = this.#priorQuery.plan();
    if (this.#expression) {
      plan.addDerivation(this.#expression);
    }

    return plan;
  }
}
