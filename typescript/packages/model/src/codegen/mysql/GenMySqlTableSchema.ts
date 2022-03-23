import { CodegenFile } from "../CodegenFile.js";
import CodegenStep from "../CodegenStep.js";
import Schema from "../../schema/Schema.js";
import { getEdgeProps } from "../../schema/schemaUtils.js";
import { fieldToMySqlType } from "./mysqlUtils.js";
import MySqlFile from "./MySqlFile.js";

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
    return new MySqlFile(
      this.schema.getModelTypeName() + ".sql",
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
      ...getEdgeProps(this.schema.getEdges()),
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
