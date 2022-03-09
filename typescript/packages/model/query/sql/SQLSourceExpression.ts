import { DerivedExpression, filter, hop, orderBy, SourceExpression, take } from "../Expression";
import SQLSourceChunkIterable from './SQLSourceChunkIterable';
import Plan from "../Plan";
import { ChunkIterable } from "../ChunkIterable";
import { Schema } from "../../schema/Schema";
type HoistedOperations<T> = {
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
    return new SQLSourceChunkIterable();
  }

  optimize(plan: Plan): Plan {
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
          this.#optimizeTake();
          break;
        case "before":
          this.#optimizeBefore();
          break;
        case "after":
          this.#optimizeAfter();
          break;
        case "orderBy":
          this.#optimizeOrderBy();
          break;
        case "hop":
          // optimizing a hop will consume remaining expressions...?
          // no... not things that need chaining after this expression.
          // how can we let optimizeHop consume derivations?
          // updates the index of the loop?
          this.#optimizeHop();
          break;
        default:
          remainingExpressions.push(derivation);
      }
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

  #optimizeHop(): boolean { return false; }
}
