import Schema from "../schema/Schema";
import SQLSourceQuery from "./sql/SQLSourceQuery";

const factory = {
  createSourceQueryFor(schema: Schema) {
    switch (schema.getConfig().storage.providerType) {
      case "MySQL":
        return new SQLSourceQuery(schema);
      case "Neo4j":
        throw new Error("Neo4j is not yet supported");
      case "Wire":
        throw new Error("Wire is not yet supported");
    }
  },
};

export default factory;
