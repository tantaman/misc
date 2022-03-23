import Schema from "../schema/Schema.js";
import CodegenStep from "./CodegenStep.js";
import GenTypescriptModel from "./typescript/GenTypescriptModel.js";
import * as fs from "fs";
import GenTypescriptQuery from "./typescript/GenTypescriptQuery.js";
// @ts-ignore
import prettier from "prettier";
import { ALGOL_TEMPLATE, sign } from "./CodegenFile.js";

const defaultSteps: Array<{ new (Schema): CodegenStep }> = [
  GenTypescriptModel,
  GenTypescriptQuery,
];

export default class CodegenPipleine {
  constructor(
    private readonly steps: Array<{ new (Schema): CodegenStep }> = defaultSteps
  ) {}

  async gen(schemas: Array<Schema>, dest: string) {
    const files = schemas.flatMap((schema) =>
      this.steps.map((step) => new step(schema).gen())
    );

    await Promise.all(
      files.map(
        async (f) =>
          await fs.promises.writeFile(
            dest + "/" + f.name,
            sign(
              prettier.format(f.contents, { parser: "typescript" }),
              ALGOL_TEMPLATE
            )
          )
      )
    );
  }
}
