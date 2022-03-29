import {
  EdgeDeclaration,
  EdgeReferenceDeclaration,
} from "../parser/SchemaType.js";
import node from "./node.js";

export default {
  queryTypeName(edge: EdgeDeclaration | EdgeReferenceDeclaration): string {
    switch (edge.type) {
      case "edge":
        // this is wrong.
        // if we're through a field we must resolve the type.
        return node.queryTypeName(edge.throughOrTo.type);
      case "edgeReference":
        return edge.name + "Query";
    }
  },
};
