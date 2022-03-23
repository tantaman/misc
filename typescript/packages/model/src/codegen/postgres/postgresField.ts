import { FieldEdge } from "../../schema/Edge";
import { FieldType, Field } from "../../schema/Field";

export function fieldToPostgresType(
  field: Field<FieldType> | FieldEdge
): string {
  const storageType = field.storageType;
  switch (storageType) {
    case "int32":
      return "INT";
    case "float32":
      return "FLOAT";
    case "int64":
    case "uint64":
    case "id":
      return "BIGINT";
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
