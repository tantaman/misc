import { maybeMap } from "@strut/utils";
import Schema from "../schema/Schema.js";
import CodegenStep from "./CodegenStep.js";
import GenTypescriptModel from "./typescript/GenTypescriptModel.js";
import * as fs from "fs";
import GenTypescriptQuery from "./typescript/GenTypescriptQuery.js";
import GenMySqlTableSchema from "./mysql/GenMySQLTableSchema.js";

const defaultSteps: Array<{
  new (Schema): CodegenStep;
  accepts: (Schema) => boolean;
}> = [GenTypescriptModel, GenTypescriptQuery, GenMySqlTableSchema];

export default class CodegenPipleine {
  constructor(
    private readonly steps: Array<{ new (Schema): CodegenStep }> = defaultSteps
  ) {}

  async gen(schemas: Array<Schema>, dest: string) {
    const files = schemas.flatMap((schema) =>
      maybeMap(
        this.steps,
        (step) => step.accepts(schema) && new step(schema).gen()
      )
    );

    await Promise.all(
      files.map(
        async (f) =>
          await fs.promises.writeFile(dest + "/" + f.name, f.contents)
      )
    );
  }
}
