import Field from "schema/Field";
import Schema from "../../schema/Schema";

class IDOnlySchema extends Schema {
  fields() {
    return {
      id: Field.id.sid(),
    };
  }
}

class PrimitiveFieldsSchema extends Schema {
  fields() {
    return {
      bool: Field.bool(),
      string: Field.stringOf("string"),
    };
  }
}
