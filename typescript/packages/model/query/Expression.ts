// If you make this a module you can allow other files to extend the type

import Plan from "./Plan";
import { IChunkIterable } from "./ChunkIterable";

// like as is done in tiptap
export type Expression =
  | ReturnType<typeof first>
  | ReturnType<typeof last>
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

export function first(first: number): {
  type: "first";
  first: number;
} {
  return { type: "first", first };
}

export function last(last: number): { type: "last"; last: number } {
  return { type: "last", last };
}

export function before(cursor: string): { type: "before"; cursor: string } {
  return { type: "before", cursor };
}

export function after(cursor: string): { type: "after"; cursor: string } {
  return { type: "after", cursor };
}

export interface ISourceExpression<TOut> {
  readonly iterable: IChunkIterable<TOut>;
  optimize(plan: Plan): Plan;
}

export interface IDerivedExpression<TIn, TOut> {
  chainAfter(iterable: IChunkIterable<TIn>): IChunkIterable<TOut>;
}
