import { ChunkIterable } from "./ChunkIterable";
import { DerivedExpression, SourceExpression } from "./Expression";

export default class Plan {
  #source: SourceExpression<any>;
  // pairwise TIn and TOuts should match
  #derivations: DerivedExpression<any, any>[];

  constructor(
    source: SourceExpression<any>,
    derivations: DerivedExpression<any, any>[]
  ) {
    this.#source = source;
    this.#derivations = derivations;
  }

  get derivations(): ReadonlyArray<DerivedExpression<any, any>> {
    return this.#derivations;
  }

  get iterable(): ChunkIterable<any> /* final TOut */ {
    let iterable = this.#source.iterable;
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

  optimize() {
    return this.#source.optimize(this);
  }
}
