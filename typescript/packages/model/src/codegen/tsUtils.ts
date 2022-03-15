import { Field, FieldType, MapField } from "../schema/Field.js";

function fieldToTsType(field: Field<FieldType>): string {
  switch (field.storageType) {
    case "id":
      // TODO: pull in the correct id type.
      return "SID_of<any>";
    case "int32":
      return "number";
    case "int64":
    case "uint64":
      // since JS can't represent 64 bit numbers -- 53 bits is js max int.
      return "string";
    case "map":
      return `ReadonlyMap<string, ${fieldToTsType(
        (field as MapField<any, any>).valueType
      )}>`;
  }

  return field.storageType;
}

export { fieldToTsType };
