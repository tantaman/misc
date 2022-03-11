import Schema from "../../schema/Schema.js";
import { BaseChunkIterable } from "../ChunkIterable.js";
import { HoistedOperations } from "./SQLSourceExpression.js";

export default class SQLSourceChunkIterable<T> extends BaseChunkIterable<T> {
  constructor(schema: Schema, hoistedOperations: HoistedOperations) {
    super();
  }

  async *[Symbol.asyncIterator](): AsyncIterator<readonly T[]> {
    // now take our hoisted operations and craft the SQL query we need.
  }
}
