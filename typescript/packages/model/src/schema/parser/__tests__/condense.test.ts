import { ast, schemaFile } from "./testSchemaFile.js";
import condense from "../condense.js";
import { parseString } from "../parse";

test("Condensing the AST to proper schema types", () => {
  const [_errors, condensed] = condense(ast);
  expect(condensed).toEqual(schemaFile);
});

test("Duplicate nodes", () => {
  const ast = parseString(`
engine: postgres
db: test
Node<Foo> {}
Node<Foo> {}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-nodes");
  // we still return data, even when we have errors.
  expect(condensed.nodes["Foo"]).not.toBeUndefined();
});

test("Duplicate top level edges", () => {
  const ast = parseString(`
engine: postgres
db: test
Edge<Person, Person> as Friends {}
Edge<Person, Person> as Friends {}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-edges");
  // we still return data, even when we have errors.
  expect(condensed.edges["Friends"]).not.toBeUndefined();
});

test("Duplicate fields on node", () => {
  const ast = parseString(`
engine: postgres
db: test
Node<Foo> {
  bar: int32
  bar: int32
}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-fields");
  // we still return data, even when we have errors.
  expect(condensed.nodes["Foo"].fields["bar"]).not.toBeUndefined();
});

test("Duplicate outbound edges on node", () => {
  const ast = parseString(`
engine: postgres
db: test
Edge<Foo, Foo> as Bar {
  bar: int32
  bar: int32
}
`);
  const [errors, condensed] = condense(ast);
  expect(errors.length).toBe(1);
  expect(errors[0].type).toEqual("duplicate-fields");
  // we still return data, even when we have errors.
  expect(condensed.edges["Foo"].fields["bar"]).not.toBeUndefined();
});

test("Duplicate inbound edges on node", () => {});

test("Duplicate extensions on node", () => {});

test("Duplicate extensions on edge", () => {});

test("Duplicate fields on edge", () => {});
