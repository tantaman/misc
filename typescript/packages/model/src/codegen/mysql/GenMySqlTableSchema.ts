import { CodegenFile } from "codegen/CodegenFile";
import CodegenStep from "codegen/CodegenStep";
import Schema from "../../schema/Schema";

export default class GenMySqlTableSchema extends CodegenStep {
  constructor(private schema: Schema) {
    super();
  }

  gen(): CodegenFile {
    return {
      name: this.schema.getModelTypeName() + ".mysql",
      contents: `CREATE TABLE ${this.schema.getModelTypeName()} (
        ${this.getColumnDefinitionsCode()}
        ${this.getPrimaryKeyCode()}
        ${this.getIndexDefinitionsCode()}
      );`,
    };
  }

  private getColumnDefinitionsCode() {}

  private getPrimaryKeyCode() {}

  private getIndexDefinitionsCode() {}
}
