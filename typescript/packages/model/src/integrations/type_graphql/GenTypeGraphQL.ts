import { CodegenFile } from "../../codegen/CodegenFile";
import CodegenStep from "../../codegen/CodegenStep";

export default class GenTypeGraphQL extends CodegenStep {
  gen(): CodegenFile {
    return {
      name: "",
      contents: "",
    };
  }
}
