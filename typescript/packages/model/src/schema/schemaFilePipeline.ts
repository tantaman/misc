import {
  Edge,
  EdgeReference,
  Node,
  NodeReference,
  SchemaFile,
  ValidatedEdge,
  ValidatedNode,
  ValidatedSchemaFile,
} from "./SchemaType.js";
import nearley from "nearley";
import Grammar from "schema/parser/Grammar.js";
import * as fs from "fs";

type ValidationError = {
  message: string;
  severity: "warning" | "advice" | "error";
};

function parse(filePath: string): SchemaFile {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Grammar));
  const schemaFileContents = fs.readFileSync(filePath, {
    encoding: "utf8",
    flag: "r",
  });

  parser.feed(schemaFileContents);
  return parser.results[0] as SchemaFile;
}

function condense(
  schemaFile: SchemaFile
): [ValidationError[], ValidatedSchemaFile] {
  // Iterate over all the things in the schema file
  // set up storage configs with defaults that were defined in the preamble
  // ensure no collisions on node/edge names
  // ensure no collisions on field names
  // suggest indexing of foreign keys
  // ensure primary keys exist
  // ...
  // we should probs support imports at some point in time
  // convert edges to field / foreign key / junction / ... types
  const ret: ValidatedSchemaFile = {
    nodes: {},
    edges: {},
  };

  const [nodes, edges] = schemaFile.entities.reduce(
    (left: [Node[], Edge[]], nodeOrEdge) => {
      nodeOrEdge.type === "node"
        ? left[0].push(nodeOrEdge)
        : left[1].push(nodeOrEdge);
      return left;
    },
    [[], []]
  );

  let errors: ValidationError[] = [];
  const nodesByName = nodes.reduce((l, r) => {
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

  const [nodeValidationErrors, validatedNodes] = validateNodes(nodesByName);
  errors = errors.concat(nodeValidationErrors);

  const [edgeValidationErrors, validatedEdges] = validateEdges(edgesByName);
  errors = errors.concat(edgeValidationErrors);

  return [
    errors,
    {
      nodes: validatedNodes,
      edges: validatedEdges,
    },
  ];
}

function validateNodes(nodes: { [key: NodeReference]: Node }): [
  ValidationError[],
  {
    [key: NodeReference]: ValidatedNode;
  }
] {
  return [[], {}];
}

function validateEdges(edges: { [key: EdgeReference]: Edge }): [
  ValidationError[],
  {
    [key: EdgeReference]: ValidatedEdge;
  }
] {
  return [[], {}];
}
