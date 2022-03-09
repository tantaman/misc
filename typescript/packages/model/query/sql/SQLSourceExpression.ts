import { DerivedExpression, filter, hop, HopExpression, orderBy, SourceExpression, take } from "../Expression";
import SQLSourceChunkIterable from './SQLSourceChunkIterable';
import Plan from "../Plan";
import { ChunkIterable } from "../ChunkIterable";
import { Schema } from "../../schema/Schema";
import HopPlan from "../HopPlan";
export type HoistedOperations<T> = {
  filters?: readonly ReturnType<typeof filter<T, any>>[];
  orderBy?: ReturnType<typeof orderBy<T, any>>;
  limit?: ReturnType<typeof take<T>>;
  // So we know what to select from.
  // What we're selecting from is determined by the final hoistable hop.
  terminalSchema?: Schema;
  hop?: ReturnType<typeof hop>;
  // What we're actually selecting.
  // Could be IDs if we can't hoist the next hop and need to load them into the server for
  // the next hop. Could be based on what the caller asked for (count / ids / edges / models).
  what: 'model' | 'ids' | 'edges' | 'count';
};

export default class SQLSourceExpression<T> implements SourceExpression<T> {
  constructor(
    // we should take a schema instead of db
    // we'd need the schema to know if we can hoist certain fields or not
    private schema: Schema,
    private hoistedOperations: HoistedOperations<T>
  ) {}

  get iterable(): ChunkIterable<T> {
    return new SQLSourceChunkIterable(
      this.schema,
      this.hoistedOperations,
    );
  }

  optimize(plan: Plan, nextHop?: HopPlan): Plan {
    const remainingExpressions: DerivedExpression<any, any>[] = [];
    let {
      filters,
      orderBy,
      limit,
      terminalSchema,
      hop,
      what
    } = this.hoistedOperations;
    filters = [...filters];

    for (let i = 0; i < plan.derivations.length; ++i) {
      const derivation = plan.derivations[i];
      switch (derivation.type) {
        case "filter":
          if (!this.#optimizeFilter(derivation)) {
            remainingExpressions.push(derivation);
          }
          break;
        case "take":
          if (!this.#optimizeTake()) {
            remainingExpressions.push(derivation);
          }
          break;
        case "before":
          if (!this.#optimizeBefore()) {
            remainingExpressions.push(derivation);
          }
          break;
        case "after":
          if (!this.#optimizeAfter()) {
            remainingExpressions.push(derivation);
          }
          break;
        case "orderBy":
          if (!this.#optimizeOrderBy()) {
            remainingExpressions.push(derivation);
          }
          break;
        case "hop":
          // This can't happen... hop will be in `nextHop`
          throw new Error('Hops should be passed in as hop plans');
        default:
          remainingExpressions.push(derivation);
      }
    }

    if (nextHop) {
      this.#optimizeHop(nextHop);
      // We need to take remainingExpressions out of nextHop and push...
      // NextHop is as optimized as possible at this point.
      // Whether the hop expression can be folded into the source expression is the only thing to check for.
      // All other expressions in the hop are not foldable.
    }

    return new Plan(
      new SQLSourceExpression(this.schema, { filters, orderBy, limit, terminalSchema, hop, what }),
      remainingExpressions
    );
  }

  #optimizeFilter(expression: ReturnType<typeof filter<any, any>>): boolean {
    return false;
  }

  #optimizeTake(): boolean { return false; }

  #optimizeBefore(): boolean { return false; }

  #optimizeAfter(): boolean { return false; }

  #optimizeOrderBy(): boolean { return false; }

  #optimizeHop(hop: HopPlan): boolean { return false; }
}
