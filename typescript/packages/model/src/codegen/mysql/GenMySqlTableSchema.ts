import { CodegenFile } from "../CodegenFile.js";
import CodegenStep from "../CodegenStep.js";
import Schema from "../../schema/Schema.js";

export default class GenMySqlTableSchema extends CodegenStep {
  static accepts(schema: Schema): boolean {
    return schema.getConfig().storage.providerType === "MySQL";
  }

  constructor(private schema: Schema) {
    super();
    // TODO: we should only return a step if the schema is
    // compatible.
  }

  gen(): CodegenFile {
    return {
      name: this.schema.getModelTypeName() + ".sql",
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
