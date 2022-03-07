import { ChunkIterable } from "./ChunkIterable";
import { IDerivedExpression, ISourceExpression } from "./Expression";

export default class Plan {
  #source: ISourceExpression<any>;
  // pairwise TIn and TOuts should match
  #derivations: IDerivedExpression<any, any>[];

  constructor(
    source: ISourceExpression<any>,
    derivations: IDerivedExpression<any, any>[]
  ) {
    this.#source = source;
    this.#derivations = derivations;
  }

  get derivations(): ReadonlyArray<IDerivedExpression<any, any>> {
    return this.#derivations;
  }

  get iterable(): ChunkIterable<any> /* final TOut */ {
    let iterable = this.#source.iterable;
    return this.#derivations.reduce(
      (iterable, expression) => expression.chainAfter(iterable),
      iterable
    );
  }

  addDerivation(expression?: IDerivedExpression<any, any>): this {
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
