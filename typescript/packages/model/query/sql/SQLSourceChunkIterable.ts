import { Schema } from "../../schema/Schema";
import { BaseChunkIterable } from "../ChunkIterable";
import { HoistedOperations } from "./SQLSourceExpression";

export default class SQLSourceChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(schema: Schema, hoistedOperations: HoistedOperations<T>) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    // now take our hoisted operations and craft the SQL query we need.
  }
}
