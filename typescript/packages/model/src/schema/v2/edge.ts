import {
  EdgeDeclaration,
  EdgeReferenceDeclaration,
  Node,
} from "../parser/SchemaType.js";
import nodeFn from "./node.js";

export default {
  queryTypeName(
    node: Node,
    edge: EdgeDeclaration | EdgeReferenceDeclaration
  ): string {
    switch (edge.type) {
      case "edge":
        // The edge is either through or to the provided node type.
        // This could be:
        // Edge<Foo.barId>
        // or
        // Edge<Foo>
        if (edge.throughOrTo.type === node.name) {
          const column = edge.throughOrTo.column;
          if (column == null) {
            throw new Error(
              "Locally declared edge that is not _through_ something is currently unsupported"
            );
          }

          // Going through some id on ourself to some other thing (or even back to ourself)
          const throughField = node.fields[column];
          // if we're going _through_ a field, it must be an ID field.
          if (throughField.type !== "id") {
            throw new Error(
              `Cannot query through non-id field ${column} for edge ${edge.name} in node ${node.name}`
            );
          }

          return throughField.of + "Query";
        }

        // If we're here then we're through or to some other type that isn't our node type.
        return nodeFn.queryTypeName(edge.throughOrTo.type);
      case "edgeReference":
        return edge.name + "Query";
    }
  },
};
