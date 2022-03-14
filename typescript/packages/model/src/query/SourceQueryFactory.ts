import { Spec } from "../Model";
import SQLSourceQuery from "./sql/SQLSourceQuery";

const factory = {
  createSourceQueryFor<T>(spec: Spec<T>) {
    switch (spec.getNativeStorageType()) {
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
