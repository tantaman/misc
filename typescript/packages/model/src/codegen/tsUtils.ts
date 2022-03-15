import { Field, FieldType, MapField } from "../schema/Field.js";

function fieldToTsType(field: Field<FieldType>): string {
  switch (field.type) {
    case "id":
      // TODO: pull in the correct id type.
      return "SID_of<any>";
    case "int":
      return "number";
    case "map":
      return `ReadonlyMap<string, ${fieldToTsType(
        (field as MapField<any, any>).valueType
      )}>`;
  }

  return field.type;
}

export { fieldToTsType };
