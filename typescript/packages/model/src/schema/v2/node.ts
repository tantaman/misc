import { ID, Node } from "../parser/SchemaType.js";

const inboundEdges = {
  isForeignKeyEdge() {},

  isFieldEdge() {},

  isJunctionEdge() {},
};

const outboundEdges = {
  isForeignKeyEdge() {},

  isFieldEdge() {},

  isJunctionEdge() {},
};

const fields = {};

export default {
  allEdges(node: Node) {
    const inboundEdges = Object.values(
      node.extensions.inboundEdges?.edges || {}
    );
    const outboundEdges = Object.values(
      node.extensions.outboundEdges?.edges || {}
    );

    return [...inboundEdges, ...outboundEdges];
  },

  queryTypeName(nodeName: string): string {
    return nodeName + "Query";
  },
};
