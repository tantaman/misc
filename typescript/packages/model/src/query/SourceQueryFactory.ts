import { Spec } from "../Model";
import SQLSourceQuery from "./sql/SQLSourceQuery";

// Runtime factory so we can swap to `Wire` when running on a client vs
// the native platform.
const factory = {
  createSourceQueryFor<T>(spec: Spec<T>) {
    switch (spec.nativeStorageType) {
      case "MySQL":
        return new SQLSourceQuery(spec);
      case "Neo4j":
        throw new Error("Neo4j is not yet supported");
      case "Wire":
        throw new Error("Wire is not yet supported");
    }
  },
};

export default factory;
