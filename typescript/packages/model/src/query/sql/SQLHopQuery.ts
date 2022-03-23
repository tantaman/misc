import { invariant } from "@strut/utils";
import { HopExpression } from "query/Expression.js";
import { HopQuery, Query } from "query/Query";
import { StorageDescriptor } from "schema/StorageConfig.js";
import { Spec } from "../../Model.js";

export default class SQLHopQuery<TIn, TOut> extends HopQuery<TIn, TOut> {
  /*
  A SQL hop query means that the next thing is SQL backed.
  We'll take source and see what the source is to determine what HOP
  expression to construct?
  */
  static create<TIn, TOut>(
    sourceQuery: Query<TIn>,
    sourceSpec: Spec<TIn>,
    destSpec: Spec<TOut>
  ) {
    // based on source and dest spec, determine the appropriate hop expression
    return new SQLHopQuery(sourceQuery, createExpression(sourceSpec, destSpec));
  }
}

function createExpression<TIn, TOut>(
  sourceSpec: Spec<TIn>,
  destSpec: Spec<TOut>
): HopExpression<TIn, TOut> {
  if (sourceSpec.storageDescriptor.nativeStorageType === "MySQL") {
    invariant(
      destSpec.storageDescriptor.nativeStorageType === "MySQL",
      "SQLHopQuery created for non-sql destination"
    );

    // If we're the same storage on the same DB, we can use a join expression
    if (
      sourceSpec.storageDescriptor.dbName === destSpec.storageDescriptor.dbName
    ) {
      return createJoinExpression(
        sourceSpec.storageDescriptor,
        destSpec.storageDescriptor
      );
    }
  }

  return createChainedHopExpression(
    sourceSpec.storageDescriptor,
    destSpec.storageDescriptor
  );
}

function createJoinExpression<TIn, TOut>(
  sourceDescriptor: StorageDescriptor,
  destDescriptor: StorageDescriptor
): HopExpression<TIn, TOut> {
  throw new Error("Join not yet supported");
}

function createChainedHopExpression<TIn, TOut>(
  sourceDescriptor: StorageDescriptor,
  destDescriptor: StorageDescriptor
): HopExpression<TIn, TOut> {
  throw new Error("In memory hop not yet supported");
}
