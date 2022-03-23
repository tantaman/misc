import { CodegenFile } from "../CodegenFile.js";
import CodegenStep from "../CodegenStep.js";
import Schema from "../../schema/Schema.js";
import { fieldToMySqlType } from "./mysqlField.js";
import SqlFile from "../SqlFile.js";

export default class GenMySqlTableSchema extends CodegenStep {
  static accepts(schema: Schema): boolean {
    return schema.getConfig().storage.providerType === "MySQL";
  }

  constructor(private schema: Schema) {
    super();
  }

  gen(): CodegenFile {
    return new SqlFile(
      this.schema.getModelTypeName() + ".my.sql",
      `CREATE TABLE ${this.schema.getModelTypeName()} (
        ${this.getColumnDefinitionsCode()}
        ${this.getPrimaryKeyCode()}
        ${this.getIndexDefinitionsCode()}
      );`
    );
  }

  private getColumnDefinitionsCode(): string {
    const fields = [
      ...Object.values(this.schema.getFields()),
      ...this.schema.getFieldsDefinedThroughEdges(),
    ];

    return fields.map((f) => `${f.name} ${fieldToMySqlType(f)}`).join(",\n");
  }

  private getPrimaryKeyCode(): string {
    return "";
  }

  private getIndexDefinitionsCode(): string {
    return "";
  }
}
