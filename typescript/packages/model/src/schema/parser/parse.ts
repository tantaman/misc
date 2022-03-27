import nearley from "nearley";
import * as Grammar from "./Grammar.js";
import * as fs from "fs";
import { SchemaFileAst } from "./SchemaType.js";

export default function parse(filePath: string): SchemaFileAst {
  const schemaFileContents = fs.readFileSync(filePath, {
    encoding: "utf8",
    flag: "r",
  });

  return parseString(schemaFileContents);
}

export function parseString(schemaFileContents: string): SchemaFileAst {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Grammar));

  parser.feed(schemaFileContents);
  return parser.results[0] as SchemaFileAst;
}
