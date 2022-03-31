import * as fs from "fs";
import { contents, ast } from "./testSchemaFile.js";
import grammar from "../ohm/grammar.js";

test("parsing a small schema", () => {
  const match = grammar.match(contents);
  console.log(match.message);
  expect(match.succeeded()).toBe(true);
});
