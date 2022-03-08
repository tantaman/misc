import { BaseChunkIterable, ChunkIterable } from "../ChunkIterable";
import { DerivedExpression, SourceExpression } from "../Expression";
import Plan from "../Plan";

class DBSourceExpression<T> implements SourceExpression<T> {
  constructor(private database: string, private sql: string) {}

  get iterable(): ChunkIterable<T> {
    return new DBSourceChunkIterable();
  }

  optimize(plan: Plan): Plan {
    const remainingExpressions: DerivedExpression<any, any>[] = [];
    const filters = [];
    for (const derivation of plan.derivations) {
      if (derivation.type === "filter") {
        filters.push(derivation);
      }
    }
  }
}

class DBSourceChunkIterable<T> extends BaseChunkIterable<T> {}
