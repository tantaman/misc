import { FieldEdge } from "../../schema/Edge.js";
import { Field, FieldType } from "../../schema/Field.js";

export function fieldToMySqlType(field: Field<FieldType> | FieldEdge): string {
  const storageType = field.storageType;
  switch (storageType) {
    case "id":
      return "BIGINT UNSIGNED";
    case "int32":
      return "INT";
    case "float32":
      return "FLOAT";
    case "int64":
      return "BIGINT";
    case "uint64":
      return "BIGINT UNSIGNED";
    case "map":
      return "JSON";
    case "string":
      // TODO: take length into account
      return "TEXT";
    case "boolean":
      return "BOOLEAN";
    case "array":
      return "ARRAY";
  }
}
