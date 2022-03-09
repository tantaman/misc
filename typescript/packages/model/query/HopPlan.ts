import { ChunkIterable } from "./ChunkIterable";
import { DerivedExpression, Expression, HopExpression } from "./Expression";
import { IPlan } from "./Plan";

export default class HopPlan implements IPlan {
  #sourcePlan: IPlan;
  #hop: HopExpression<any, any>;
  #derivations: Expression[];

  constructor(
    sourcePlan: IPlan,
    hop: HopExpression<any, any>,
    derivations: Expression[]
  ) {
    this.#hop = hop;
    this.#derivations = derivations;
    this.#sourcePlan = sourcePlan;
  }

  get derivations(): ReadonlyArray<Expression> {
    return this.#derivations;
  }

  get iterable(): ChunkIterable<any> {
    const iterable = this.#hop.chainAfter(this.#sourcePlan.iterable);
    return this.#derivations.reduce(
      (iterable, expression) => expression.chainAfter(iterable),
      iterable
    );
  }

  addDerivation(expression?: DerivedExpression<any, any>): this {
    if (!expression) {
      return this;
    }

    this.#derivations.push(expression);

    return this;
  }

  /**
   * Queries are built up into a reverse linked list.
   * The last query is what the user executes.
   * This last query will optimize from the end back on down.
   */
  optimize(nextHop?: HopPlan) {
    // Optimize our hop and fold in the next hop
    const optimizedPlanForThisHop = this.#hop.optimize(this, nextHop);
    return this.#sourcePlan.optimize(optimizedPlanForThisHop);
  }
}
