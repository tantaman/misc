import {
  RawEdge,
  EdgeReference,
  RawNode,
  NodeReference,
  RawSchemaFile,
  Edge,
  Node,
  SchemaFile,
} from "./SchemaType.js";
import nearley from "nearley";
import Grammar from "schema/parser/Grammar.js";
import * as fs from "fs";

type ValidationError = {
  message: string;
  severity: "warning" | "advice" | "error";
};

function parse(filePath: string): RawSchemaFile {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Grammar));
  const schemaFileContents = fs.readFileSync(filePath, {
    encoding: "utf8",
    flag: "r",
  });

  parser.feed(schemaFileContents);
  return parser.results[0] as RawSchemaFile;
}

function condense(schemaFile: RawSchemaFile): [ValidationError[], SchemaFile] {
  // Iterate over all the things in the schema file
  // set up storage configs with defaults that were defined in the preamble
  // ensure no collisions on node/edge names
  // ensure no collisions on field names
  // suggest indexing of foreign keys
  // ensure primary keys exist
  // ...
  // we should probs support imports at some point in time
  // convert edges to field / foreign key / junction / ... types

  const [nodes, edges] = schemaFile.entities.reduce(
    (left: [RawNode[], RawEdge[]], nodeOrEdge) => {
      nodeOrEdge.type === "node"
        ? left[0].push(nodeOrEdge)
        : left[1].push(nodeOrEdge);
      return left;
    },
    [[], []]
  );

  let errors: ValidationError[] = [];
  const nodesByName: { [key: string]: RawNode } = nodes.reduce((l, r) => {
    if (l[r.name] != null) {
      errors.push({
        message: "A node has already been defined with the name " + r.name,
        severity: "error",
      });
    }
    l[r.name] = r;
    return l;
  }, {});
  const edgesByName = edges.reduce((l, r) => {
    if (l[r.name] != null) {
      errors.push({
        message: "An edge has already been defined with the name " + r.name,
        severity: "error",
      });
    }
    l[r.name] = r;
    return l;
  }, {});

  const [nodeErrors, validatedNodes] = condenseNodes(
    nodesByName,
    schemaFile.preamble
  );
  errors = errors.concat(nodeErrors);

  const [edgeErrors, validatedEdges] = condenseEdges(
    edgesByName,
    schemaFile.preamble
  );
  errors = errors.concat(edgeErrors);

  return [
    errors,
    {
      nodes: validatedNodes,
      edges: validatedEdges,
    },
  ];
}

function condenseNodes(
  nodes: { [key: NodeReference]: RawNode },
  preamble: RawSchemaFile["preamble"]
): [
  ValidationError[],
  {
    [key: NodeReference]: Node;
  }
] {
  let errors: ValidationError[] = [];
  // We condense differently based on engine?
  const condensedNodes: { [key: NodeReference]: Node } = Object.entries(
    nodes
  ).reduce((l, [key, node]) => {
    const [nodeErrors, condensed] = condenseNode(node, preamble);
    errors = errors.concat(nodeErrors);
    if (condensed) {
      l[key] = condensed;
    }
    return l;
  }, {});
  return [errors, condensedNodes];
}

function condenseNode(
  node: RawNode,
  preamble: RawSchemaFile["preamble"]
): [ValidationError[], Node | null] {
  throw new Error();
}

function condenseEdges(
  edges: { [key: EdgeReference]: RawEdge },
  preamble: RawSchemaFile["preamble"]
): [
  ValidationError[],
  {
    [key: EdgeReference]: Edge;
  }
] {
  return [[], {}];
}
