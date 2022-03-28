import condense from "schema/parser/condense";
import validate, { ValidationError } from "schema/v2/validate.js";
import parse from "../parser/parse.js";
import { SchemaFile } from "../parser/SchemaType.js";

export default function compile(path: string): [ValidationError[], SchemaFile] {
  const ast = parse(path);
  const [condenseErrors, schemaFile] = condense(ast);

  const validationErrors = validate(schemaFile);

  return [[...condenseErrors, ...validationErrors], schemaFile];
}
