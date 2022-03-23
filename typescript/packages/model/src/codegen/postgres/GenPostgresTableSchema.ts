import { CodegenFile } from "../CodegenFile.js";
import Schema from "../../schema/Schema.js";
import CodegenStep from "../CodegenStep.js";
import SqlFile from "..//SqlFile.js";
import { fieldToPostgresType } from "./postgresField.js";

export default class GenPostgresTableSchema extends CodegenStep {
  static accepts(schema: Schema): boolean {
    return schema.getConfig().storage.providerType === "Postgres";
  }

  constructor(private schema: Schema) {
    super();
  }

  gen(): CodegenFile {
    return new SqlFile(
      this.schema.getModelTypeName() + ".pg.sql",
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

    return fields.map((f) => `${f.name} ${fieldToPostgresType(f)}`).join(",\n");
  }

  private getPrimaryKeyCode(): string {
    return "";
  }

  private getIndexDefinitionsCode(): string {
    return "";
  }
}
