// If you make this a module you can allow other files to extend the type

import Plan from "./Plan";
import { ChunkIterable, TakeChunkIterable } from "./ChunkIterable";
import { Predicate } from "./Predicate";
import { FieldGetter } from "./Field";

export type ExpressionType = "take" | "before" | "after" | "filter";
export type Direction = "asc" | "dec";
/*
declare module '@mono/model/query' {
  interface Expressions<ReturnType> {
    expr: () => ReturnType;
  }
}

export type Expression = // union of the mapping of return types of the members of the interface??
// maybe something like: https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/types.ts#L197
*/

export function take<T>(num: number): {
  type: "take";
  num: number;
} & DerivedExpression<T, T> {
  return {
    type: "take",
    num,
    chainAfter(iterable) {
      return new TakeChunkIterable(iterable, num);
    },
  };
}

export function before<T>(
  cursor: string
): { type: "before"; cursor: string } & DerivedExpression<T, T> {
  return {
    type: "before",
    cursor,
    chainAfter(_) {
      throw new Error("Cursor must be consumed in plan optimization");
    },
  };
}

export function after<T>(
  cursor: string
): { type: "after"; cursor: string } & DerivedExpression<T, T> {
  return {
    type: "after",
    cursor,
    chainAfter(_) {
      throw new Error("Cursor must be consumed in plan optimization");
    },
  };
}

// Needs to be more robust as we need to know if field and value are hoistable to the backend.
// So this should be some spec that references the schema in some way.
export function filter<Tm, Tv>(
  getter: FieldGetter<Tm, Tv>,
  op: Predicate<Tv>
) {}

export function orderBy<Tm, Tv>(
  getter: FieldGetter<Tm, Tv>,
  direction: Direction
) {}
// Should have a field getter that
// 1. Has the db field
// 2. has the method if can't hoist
// Should have a predicate class
// That we can determine if hoistable or not

export interface SourceExpression<TOut> {
  readonly iterable: ChunkIterable<TOut>;
  optimize(plan: Plan): Plan;
}

export interface DerivedExpression<TIn, TOut> {
  chainAfter(iterable: ChunkIterable<TIn>): ChunkIterable<TOut>;
  type: ExpressionType;
}
