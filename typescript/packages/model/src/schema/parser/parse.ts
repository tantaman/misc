import grammar from "./ohm/grammar.js";
import * as fs from "fs";
import { SchemaFileAst } from "./SchemaType.js";

const semantics = grammar.createSemantics();
semantics.addOperation("toAst", {
  Main() {},
  PropertyList() {},
  Property() {},
  propertyKey() {},
  name() {},
  Entities() {},
  Node() {},
  Edge() {},
  NodeFields() {},
  NodeTrait() {},
  FieldDeclarations() {},
  FieldDeclaration() {},
  FieldType() {},
  NonCompositeFieldType() {},
  CompositeFieldType() {},
  IdField() {},
  NaturalLanguageField() {},
  EnumField() {},
  EnumKeys() {},
  BitmaskField() {},
  TimeField() {},
  CurrencyField() {},
  PrimitiveField() {},
  ArrayField() {},
  MapField() {},
  NodeFunctions() {},
  NodeFunction() {},
  EdgeFunctions() {},
  EdgeFunction() {},
  OutboundEdgesFn() {},
  InboundEdgesFn() {},
  IndexFn() {},
  InvertFn() {},
  ReadPrivacyFn() {},
  TraitsFn() {},
  EdgeDeclarations() {},
  EdgeDeclaration() {},
  InlineEdgeDefinition() {},
  NameOrResolution() {},
  Indices() {},
  IndexDeclaration() {},
  NameList() {},
});

export default function parse(filePath: string): SchemaFileAst {
  const schemaFileContents = fs.readFileSync(filePath, {
    encoding: "utf8",
    flag: "r",
  });

  return parseString(schemaFileContents);
}

export function parseString(schemaFileContents: string): SchemaFileAst {
  const matchResult = grammar.match(schemaFileContents);
  const adapter = semantics(matchResult);
  const ast = adapter.toAst();
  console.log(ast);
  return ast as SchemaFileAst;
}
