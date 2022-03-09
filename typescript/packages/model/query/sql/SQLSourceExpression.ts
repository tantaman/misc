import { after, before, DerivedExpression, Expression, filter, hop, HopExpression, orderBy, SourceExpression, take } from "../Expression";
import SQLSourceChunkIterable from './SQLSourceChunkIterable';
import Plan from "../Plan";
import { ChunkIterable } from "../ChunkIterable";
import { Schema } from "../../schema/Schema";
import HopPlan from "../HopPlan";
export type HoistedOperations<T> = {
  filters?: readonly ReturnType<typeof filter<T, any>>[];
  orderBy?: ReturnType<typeof orderBy<T, any>>;
  limit?: ReturnType<typeof take<T>>;
  before?: ReturnType<typeof before<T>>;
  after?: ReturnType<typeof after<T>>;
  // Points to the fully optimized hop expression.
  hop?: ReturnType<typeof hop>;
  // What we're actually selecting.
  // Could be IDs if we can't hoist the next hop and need to load them into the server for
  // the next hop. Could be based on what the caller asked for (count / ids / edges / models).
  what: 'model' | 'ids' | 'edges' | 'count';
};
import {ModelFieldGetter} from '../Field';

interface SQLResult {};

export default class SQLSourceExpression implements SourceExpression<SQLResult> {
  constructor(
    // we should take a schema instead of db
    // we'd need the schema to know if we can hoist certain fields or not
    private schema: Schema,
    private hoistedOperations: HoistedOperations<any>
  ) {}

  get iterable(): ChunkIterable<SQLResult> {
    return new SQLSourceChunkIterable(
      this.schema,
      this.hoistedOperations,
    );
  }

  optimize(plan: Plan, nextHop?: HopPlan): Plan {
    const remainingExpressions: Expression[] = [];
    let {
      filters,
      orderBy,
      limit,
      hop,
      what,
      before,
      after,
    } = this.hoistedOperations;
    const writableFilters = [...filters];

    for (let i = 0; i < plan.derivations.length; ++i) {
      const derivation = plan.derivations[i];
      switch (derivation.type) {
        case "filter":
          if (!this.#optimizeFilter(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            writableFilters.push(derivation);
          }
          break;
        case "take":
          if (!this.#optimizeTake(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            limit = derivation;
          }
          break;
        case "before":
          if (!this.#optimizeBefore(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            before = derivation;
          }
          break;
        case "after":
          if (!this.#optimizeAfter(derivation)) {
            remainingExpressions.push(derivation);
          } else {
            after = derivation;
          }
          break;
        case "orderBy":
          if (!this.#optimizeOrderBy(derivation)) {
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
      const [hoistedHop, derivedExressions] = this.#optimizeHop(nextHop, remainingExpressions.length > 0);
      for (const e of derivedExressions) {
        remainingExpressions.push(e);
      }
      hop = hoistedHop;
    }

    return new Plan(
      new SQLSourceExpression(this.schema, { filters, orderBy, limit, hop, what, before, after }),
      remainingExpressions
    );
  }

  #optimizeFilter(expression: ReturnType<typeof filter>): boolean {
    if (
      expression.getter instanceof ModelFieldGetter
      && expression.getter.fieldName !== null
      && expression.getter.schema === this.schema
    ) {
      return true;
    }
    return false;
  }

  #optimizeTake(expression: ReturnType<typeof take>): boolean { return false; }

  #optimizeBefore(expression: ReturnType<typeof before>): boolean { return false; }

  #optimizeAfter(expression: ReturnType<typeof after>): boolean { return false; }

  #optimizeOrderBy(expression: ReturnType<typeof orderBy>): boolean { return false; }

  #optimizeHop(
    hop: HopPlan,
    thisHasRemainingExpressions: boolean,
  ): [HopExpression<any, any> | undefined, readonly Expression[]] {
    if (this.#canHoistHop(hop, thisHasRemainingExpressions)) {
      return [hop.hop, hop.derivations]
    }

    // can't hoist it. Just return everything as derived expressions.
    return [undefined, [hop.hop, ...hop.derivations]];
  }

  #canHoistHop(hop: HopPlan, thisHasRemainingExpressions: boolean): boolean {
    // If there are expressions that couldn't be rolled into source
    // then we can't roll the hop in too! We'd be hopping before
    // applying all expressions.
    if (thisHasRemainingExpressions) {
      return false;
    }
    return false;
  }
}
