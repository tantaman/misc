export type SchemaFile = {
  preamble: {
    engine: "postgres";
    db: string;
  };
  entities: (Node | Edge)[];
};

type RemoveNameField<Type> = {
  [Property in keyof Type as Exclude<Property, "name">]: Type[Property];
};

type NodeReference = string;
type UnqalifiedFieldReference = string;
type EdgeReference = string;

type NonComplexField =
  | ID
  | NaturalLanguage
  | Enum
  | Currency
  | Time
  | Primitive;

type ComplexField = Map | Array;

type Field = NonComplexField | ComplexField;

export type Node = {
  type: "node";
  name: string;
  fields: Field[];
  extensions: (OutboundEdges | InboundEdges | Index)[];
};

export type Edge = {
  type: "edge";
  name: string;
  src: NodeReference;
  dest: NodeReference;
  fields: Field[];
  extensions: (Index | Invert | Constrain)[];
};

type Invert = {
  type: "invert";
  name: string;
};

type Constrain = {
  type: "constrain";
};

type EdgeDeclaration = {
  type: "edge";
  name: string;
  src: {
    type: NodeReference;
    column?: UnqalifiedFieldReference;
  };
  dest: {
    type: NodeReference;
    column?: UnqalifiedFieldReference;
  } | null;
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

/*
// DSL alternative (i.e. pure js / ts):
let Person = node('Person');
Person.fields({
  id: ID(Person),
  name: NaturalLanguage('string'),
  walletId: ID(Wallet)
}).outboundEdges({
  wallet: Edge(Person.walletId),
  friends: Edge(Person, Person)
}).inboundEdges({
  ...
}).index({
  ...
}).storageOverrides({})
*/
