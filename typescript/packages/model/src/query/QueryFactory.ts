import { Spec } from "../Model";
import { DerivedQuery, HopQuery } from "./Query";
import SQLHopExpression from "./sql/SqlHopExpression";
import SQLHopQuery from "./sql/SqlHopQuery";
import SQLSourceQuery from "./sql/SqlSourceQuery";

// Runtime factory so we can swap to `Wire` when running on a client vs
// the native platform.
const factory = {
  createSourceQueryFor<T>(spec: Spec<T>) {
    switch (spec.storageDescriptor.nativeStorageType) {
      case "MySQL":
        return new SQLSourceQuery(spec);
      case "Neo4j":
        throw new Error("Neo4j is not yet supported");
      // case "Wire":
      //   throw new Error("Wire is not yet supported");
    }
  },

  createHopQueryFor<TDest>(
    priorQuery: DerivedQuery<any>,
    sourceSpec: Spec<any>,
    destSpec: Spec<TDest>
  ): HopQuery<any, TDest> {
    // SQLHopQuery and so on
    if (destSpec.storageDescriptor.nativeStorageType === "MySQL") {
      return SQLHopQuery.create(priorQuery, sourceSpec, destSpec);
    }

    throw new Error("Unimplemented hop");
  },
};

export default factory;
