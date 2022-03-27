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
  Field,
} from "./SchemaType.js";

type ValidationError = {
  message: string;
  severity: "warning" | "advice" | "error";
};

/**
 * The AST returned by the parser gives us lists of items.
 * Convert that list of items into maps of items.
 * E.g.,
 * ```
 * {
 *   nodes: {
 *     [node.name] => node,
 *     ...
 *   }
 *   edges: {
 *     [edge.name] => edge,
 *     ...
 *   }
 * }
 * ```
 *
 * Descends into nodes and edges and does the same for their fields
 * and extensions.
 *
 * We do this so we can easily look up nodes and edges when one node/edge refers
 * to another.
 *
 * We also gether up a list of errors that occur in this process, such as
 * field/edge/node/extension name conflicts.
 *
 * These errors are reported to the user further upstream.
 *
 * We collect as many as we can, rather than bailing early, so the user
 * can fix all errors before having to re-run compilation.
 */
export function condense(
  schemaFile: SchemaFileAst
): [ValidationError[], SchemaFile] {
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
  const condensedNodes: { [key: NodeReference]: Node } = Object.entries(
    nodes
  ).reduce((l, [key, node]) => {
    const [nodeErrors, condensed] = condenseNode(node, preamble);
    errors = errors.concat(nodeErrors);
    l[key] = condensed;
    return l;
  }, {});
  return [errors, condensedNodes];
}

function condenseNode(
  node: NodeAst,
  preamble: SchemaFileAst["preamble"]
): [ValidationError[], Node] {
  const [fieldErrors, fields] = condenseFieldsFor("Node", node);
  const [extensionErrors, extensions] = condenseExtensionsFor("Node", node);

  return [
    [...fieldErrors, ...extensionErrors],
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

function condenseEdge() {
  // const [fieldErrors, fields] = condenseFieldsFor("Edge", edge)
}

function condenseFieldsFor(
  entityType: string,
  entity: { name: string; fields: Field[] }
) {
  return arrayToMap(
    entity.fields,
    (f) => f.name,
    (f) => ({
      message: `${entityType} ${entity.name} had duplicate fields (${f.name}) defined`,
      severity: "error",
    })
  );
}

function condenseExtensionsFor<T>(
  entityType: string,
  entity: { name: string; extensions: T[] }
) {
  return arrayToMap(
    entity.extensions,
    (e) => e.name,
    (e) => ({
      message: `${entityType} ${entity.name} had duplicate extension (${e.name}) defined`,
      severity: "error",
    })
  );
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

// Iterate over all the things in the schema file
// set up storage configs with defaults that were defined in the preamble
// ensure no collisions on node/edge names
// ensure no collisions on field names
// suggest indexing of foreign keys
// ensure primary keys exist
// ...
// we should probs support imports at some point in time
// convert edges to field / foreign key / junction / ... types
