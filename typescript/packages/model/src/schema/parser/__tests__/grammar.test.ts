import nearley from "nearley";
import compile from "nearley/lib/compile";
import generate from "nearley/lib/generate";
import nearleyGrammar from "nearley/lib/nearley-language-bootstrapped";
import * as fs from "fs";
import { SchemaFileAst } from "../SchemaType.js";
import { contents, ast } from "./testSchemaFile.js";

test("parsing a small schema", () => {
  const parser = new nearley.Parser(
    nearley.Grammar.fromCompiled(compileGrammar())
  );

  parser.feed(contents);
  const schema = parser.results[0] as SchemaFileAst;
  expect(schema).toEqual(ast);
});

function compileGrammar() {
  const grammarParser = new nearley.Parser(nearleyGrammar);
  const ourGrammar = readResourceFile("../Grammar.ne");
  grammarParser.feed(ourGrammar);

  const grammarAst = grammarParser.results[0];
  const grammarInfoObject = compile(grammarAst, {});
  const grammarJs = generate(grammarInfoObject, "grammar");
  const module: any = { exports: {} };
  eval(grammarJs);

  return module.exports;
}

function readResourceFile(path: string): string {
  const ourDir = __dirname;
  const resourcePath = ourDir.replace("/lib/", "/src/") + "/" + path;

  return fs.readFileSync(resourcePath, { encoding: "utf8", flag: "r" });
}
