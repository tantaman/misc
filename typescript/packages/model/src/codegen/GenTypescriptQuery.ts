import Schema from "../schema/Schema.js";
import { CodegenFile } from "./CodegenFile.js";
import CodegenStep from "./CodegenStep.js";

export default class GenTypescriptQuery extends CodegenStep {
  constructor(private schema: Schema) {
    super();
  }

  gen(): CodegenFile {
    return {
      name: this.schema.getQueryTypeName() + ".ts",
      contents: "",
    };
  }
}
