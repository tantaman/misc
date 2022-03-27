export type StorageEngine = "postgres"; // mysql | maria | neo4j | redis ...
export type StorageType = "sql"; // opencypher

export type SchemaFileAst = {
  preamble: {
    engine: StorageEngine;
    db: string;
  };
  entities: (NodeAst | EdgeAst)[];
};

export type SchemaFile = {
  nodes: {
    [key: NodeReference]: Node;
  };
  edges: {
    [key: EdgeReference]: Edge;
  };
};

export type Node = {
  name: NodeAst["name"];
  fields: {
    [key: UnqalifiedFieldReference]: Field;
  };
  extensions: {
    [Property in NodeExtension["name"]]?: NodeExtension;
  };
  storage: StorageConfig;
};

type StorageConfig = {
  type: "sql";
  db: string;
  table: string;
  engine: StorageEngine;
}; // | { type: "opencypher" } ...;

export type Edge = {
  name: EdgeAst["name"];
  src: NodeReferenceOrQualifiedColumn;
  dest: NodeReferenceOrQualifiedColumn | null;
  fields: {
    [key: UnqalifiedFieldReference]: Field;
  };
  extensions: {
    [Property in EdgeExtension["name"]]: EdgeExtension;
  };
  storage: StorageConfig;
};

type RemoveNameField<Type> = {
  [Property in keyof Type as Exclude<Property, "name">]: Type[Property];
};

export type NodeReference = string;
type UnqalifiedFieldReference = string;
export type EdgeReference = string;

type NonComplexField =
  | ID
  | NaturalLanguage
  | Enum
  | Currency
  | Time
  | Primitive;

type ComplexField = Map | Array;

export type Field = NonComplexField | ComplexField;
type NodeExtension = OutboundEdges | InboundEdges | Index;

export type NodeAst = {
  type: "node";
  name: string;
  fields: Field[];
  extensions: NodeExtension[];
  table?: string;
};

type EdgeExtension = Index | Invert | Constrain;

export type EdgeAst = {
  type: "edge";
  name: string;
  src: NodeReferenceOrQualifiedColumn;
  dest: NodeReferenceOrQualifiedColumn | null;
  fields: Field[];
  extensions: EdgeExtension[];
};

type Invert = {
  name: "invert";
  as: string;
};

type Constrain = {
  name: "constrain";
};

type NodeReferenceOrQualifiedColumn = {
  type: NodeReference;
  column?: UnqalifiedFieldReference;
};

type EdgeDeclaration = {
  type: "edge";
  name: string;
  src: NodeReferenceOrQualifiedColumn;
  dest: NodeReferenceOrQualifiedColumn | null;
};

type EdgeReferenceDeclaration = {
  type: "edgeReference";
  name: string;
  reference: EdgeReference;
};

type ID = {
  name: string;
  type: "id";
  of: NodeReference;
};

type NaturalLanguage = {
  name: string;
  type: "naturalLanguage";
};

type Enum = {
  name: string;
  type: "enumeration";
  keys: string[];
};

type Currency = {
  name: string;
  type: "currency";
  denomination: string;
};

type Time = {
  name: string;
  type: "timestamp";
};

type Primitive = {
  name: string;
  type: "primitive";
  subtype:
    | "bool"
    | "int32"
    | "int64"
    | "float32"
    | "float64"
    | "uint32"
    | "uint64"
    | "string";
};

type Map = {
  name: string;
  type: "map";
  // Ideally we use `Omit` on name but see https://github.com/microsoft/TypeScript/issues/31501
  keys: RemoveNameField<NonComplexField>;
  values: RemoveNameField<Field>;
};

type Array = {
  name: string;
  type: "array";
  // Ideally we use `Omit` on name but see https://github.com/microsoft/TypeScript/issues/31501
  values: RemoveNameField<Field>;
};

type OutboundEdges = {
  name: "outboundEdges";
  declarations: (EdgeDeclaration | EdgeReferenceDeclaration)[];
};

export type InboundEdges = {
  name: "inboundEdges";
  declarations: (EdgeDeclaration | EdgeReferenceDeclaration)[];
};

type Index = {
  name: "index";
  declarations: (Unique | NonUnique)[];
};

type Unique = {
  name: string;
  type: "unique";
  columns: UnqalifiedFieldReference[];
};

type NonUnique = {
  name: string;
  type: "nonUnique";
  columns: UnqalifiedFieldReference[];
};
