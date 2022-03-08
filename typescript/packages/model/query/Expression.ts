// If you make this a module you can allow other files to extend the type

import Plan from "./Plan";
import { ChunkIterable, FirstChunkIterable } from "./ChunkIterable";

export type ExpressionType = "first" | "before" | "after" | "filter";

// like as is done in tiptap
export type Expression =
  | ReturnType<typeof first>
  | ReturnType<typeof before>
  | ReturnType<typeof after>;

/*
declare module '@mono/model/query' {
  interface Expressions<ReturnType> {
    expr: () => ReturnType;
  }
}

export type Expression = // union of the mapping of return types of the members of the interface??
// maybe something like: https://github.com/ueberdosis/tiptap/blob/main/packages/core/src/types.ts#L197
*/

export function first<T>(first: number): {
  type: "first";
  first: number;
} & IDerivedExpression<T, T> {
  return {
    type: "first",
    first,
    chainAfter(iterable) {
      return new FirstChunkIterable(iterable, first);
    },
  };
}

export function before<T>(
  cursor: string
): { type: "before"; cursor: string } & IDerivedExpression<T, T> {
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
): { type: "after"; cursor: string } & IDerivedExpression<T, T> {
  return {
    type: "after",
    cursor,
    chainAfter(_) {
      throw new Error("Cursor must be consumed in plan optimization");
    },
  };
}

export interface ISourceExpression<TOut> {
  readonly iterable: ChunkIterable<TOut>;
  optimize(plan: Plan): Plan;
}

export interface IDerivedExpression<TIn, TOut> {
  chainAfter(iterable: ChunkIterable<TIn>): ChunkIterable<TOut>;
}
