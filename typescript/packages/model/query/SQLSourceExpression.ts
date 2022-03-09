import { DerivedExpression, filter, orderBy, SourceExpression, take } from "./Expression";
import SQLSourceChunkIterable from './SQLSourceChunkIterable';
import Plan from "./Plan";
import { ChunkIterable } from "./ChunkIterable";
import { Schema } from "../schema/Schema";
type HoistedOperations<T> = {
  filters?: readonly ReturnType<typeof filter<T, any>>[];
  orderBy?: ReturnType<typeof orderBy<T, any>>;
  limit?: ReturnType<typeof take<T>>;
};


class SQLSourceExpression<T> implements SourceExpression<T> {
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
    const filters = [];
    for (const derivation of plan.derivations) {
      switch (derivation.type) {
        case "filter":
          break;
        case "take":
          break;
        case "before":
          break;
        case "after":
          break;
        case "orderBy":
          break;
        case "hop":
          break;
        default:
          remainingExpressions.push(derivation);
      }
    }

    // We need to know what we're selecting too
    // ids? all fields from the source model?
    // all fields from some model several hops down?

    return new Plan(
      new SQLSourceExpression(this.schema, { filters }),
      remainingExpressions
    );
  }
}
