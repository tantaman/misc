import {
  EdgeAst,
  EdgeReference,
  NodeAst,
  NodeReference,
  SchemaFileAst,
  Edge,
  Node,
  SchemaFile,
  StorageEngine,
  StorageType,
} from "./SchemaType.js";
import nearley from "nearley";
import Grammar from "schema/parser/Grammar.js";
import * as fs from "fs";

type ValidationError = {
  message: string;
  severity: "warning" | "advice" | "error";
};

function parse(filePath: string): SchemaFileAst {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Grammar));
  const schemaFileContents = fs.readFileSync(filePath, {
    encoding: "utf8",
    flag: "r",
  });

  parser.feed(schemaFileContents);
  return parser.results[0] as SchemaFileAst;
}

function condense(schemaFile: SchemaFileAst): [ValidationError[], SchemaFile] {
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
    (left: [NodeAst[], EdgeAst[]], nodeOrEdge) => {
      nodeOrEdge.type === "node"
        ? left[0].push(nodeOrEdge)
        : left[1].push(nodeOrEdge);
      return left;
    },
    [[], []]
  );

  const [nodeMappingErrors, nodesByName] = arrayToMap(
    nodes,
    (n) => n.name,
    (n) => ({
      message: "A node has already been defined with the name " + n.name,
      severity: "error",
    })
  );
  const [edgeMappingErrors, edgesByName] = arrayToMap(
    edges,
    (e) => e.name,
    (e) => ({
      message: "An edge has already been defined with the name " + e.name,
      severity: "error",
    })
  );

  const [nodeErrors, validatedNodes] = condenseNodes(
    nodesByName,
    schemaFile.preamble
  );

  const [edgeErrors, validatedEdges] = condenseEdges(
    edgesByName,
    schemaFile.preamble
  );

  return [
    [...nodeMappingErrors, ...edgeMappingErrors, ...nodeErrors, ...edgeErrors],
    {
      nodes: validatedNodes,
      edges: validatedEdges,
    },
  ];
}

function condenseNodes(
  nodes: { [key: NodeReference]: NodeAst },
  preamble: SchemaFileAst["preamble"]
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
    if (condensed != null) {
      l[key] = condensed;
    }
    return l;
  }, {});
  return [errors, condensedNodes];
}

function condenseNode(
  node: NodeAst,
  preamble: SchemaFileAst["preamble"]
): [ValidationError[], Node | null] {
  const [extensionErrors, extensions] = arrayToMap(
    node.extensions,
    (e) => e.name,
    (e) => ({
      message: `Node ${node.name} had duplicate extension (${e.name}) defined`,
      severity: "error",
    })
  );

  const [fieldErrors, fields] = arrayToMap(
    node.fields,
    (f) => f.name,
    (f) => ({
      message: `Node ${node.name} had duplicate fields (${f.name}) defined`,
      severity: "error",
    })
  );
  return [
    fieldErrors.concat(extensionErrors),
    {
      name: node.name,
      fields,
      extensions,
      storage: {
        type: engineToType(preamble.engine),
        engine: preamble.engine,
        db: preamble.db,
        table: node.table || node.name.toLocaleLowerCase(),
      },
    },
  ];
}

function condenseEdges(
  edges: { [key: EdgeReference]: EdgeAst },
  preamble: SchemaFileAst["preamble"]
): [
  ValidationError[],
  {
    [key: EdgeReference]: Edge;
  }
] {
  return [[], {}];
}

function engineToType(engine: StorageEngine): StorageType {
  switch (engine) {
    case "postgres":
      return "sql";
  }
}

function arrayToMap<T extends Object>(
  array: T[],
  getKey: (T) => string,
  onDuplicate: (T) => ValidationError
): [ValidationError[], { [key: string]: T }] {
  const errors: ValidationError[] = [];
  const map = array.reduce((l, r) => {
    const key = getKey(r);
    if (l[key] !== undefined) {
      errors.push(onDuplicate(r));
    }
    l[key] = r;
    return l;
  }, {});
  return [errors, map];
}
