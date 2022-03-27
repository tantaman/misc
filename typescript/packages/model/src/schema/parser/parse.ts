import nearley from "nearley";
import Grammar from "schema/parser/Grammar.js";
import * as fs from "fs";
import { SchemaFileAst } from "./SchemaType.js";

export default function parse(filePath: string): SchemaFileAst {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Grammar));
  const schemaFileContents = fs.readFileSync(filePath, {
    encoding: "utf8",
    flag: "r",
  });

  parser.feed(schemaFileContents);
  return parser.results[0] as SchemaFileAst;
}
