import { SchemaFile, ValidatedSchemaFile } from "./SchemaType.js";
import nearley from "nearley";
import Grammar from "schema/parser/Grammar.js";
import * as fs from "fs";

function parse(filePath: string): SchemaFile {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(Grammar));
  const schemaFileContents = fs.readFileSync(filePath, {
    encoding: "utf8",
    flag: "r",
  });

  parser.feed(schemaFileContents);
  return parser.results[0] as SchemaFile;
}

function validateAndCondense(schemaFile: SchemaFile): ValidatedSchemaFile {
  throw new Error();
}
