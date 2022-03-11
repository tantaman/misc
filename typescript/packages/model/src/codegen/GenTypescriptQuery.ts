import Schema from "../schema/Schema.js";
import { CodegenFile } from "./CodegenFile.js";
import CodegenStep from "./CodegenStep.js";

export default class GenTypescriptQuery extends CodegenStep {
  constructor(private schema: Schema) {
    super();
  }

  // Nit:
  // we can technically return an array of files.
  // Since we can have edge data... so we'd need edge queries rather than a query per schema.
  // b/c structure on the edges...
  gen(): CodegenFile {
    return {
      name: this.schema.getQueryTypeName() + ".ts",
      contents: "",
    };
  }
}
