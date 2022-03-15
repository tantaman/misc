import FieldAndEdgeBase from "./FieldAndEdgeBase.js";
import Schema from "./Schema.js";

export type FieldType =
  | "id"
  | "boolean"
  | "string"
  | "map"
  | "array"
  | "int32"
  | "int64"
  | "uint64"
  | "float32";

export class Field<T extends FieldType> extends FieldAndEdgeBase {
  isRequired: boolean = true;
  source: Schema;

  constructor(public readonly storageType: T) {
    super();
  }

  required(v: boolean = true): this {
    this.isRequired = v;
    return this;
  }

  optional(v: boolean = true): this {
    return this.required(!v);
  }
}

export class StringOfField extends Field<"string"> {
  constructor(private of: string) {
    super("string");
  }
}

export class MapField<
  K extends Field<"string">,
  V extends Field<FieldType>
> extends Field<"map"> {
  constructor(public readonly keyType: K, public readonly valueType: V) {
    super("map");
  }
}

export class ArrayField<V extends Field<FieldType>> extends Field<"array"> {
  constructor(public readonly valueType: V) {
    super("array");
  }
}

export default {
  id: {
    sid(): Field<"id"> {
      return new Field("id");
    },
  },

  bool(): Field<"boolean"> {
    return new Field("boolean");
  },

  // TODO: fields should require semantic meanings.
  // Look into using:
  // https://betterprogramming.pub/understanding-semantic-and-validated-types-in-typescript-4-54ce43d7d90f
  int32(): Field<"int32"> {
    return new Field("int32");
  },

  int64(): Field<"int64"> {
    return new Field("int64");
  },

  uint64(): Field<"uint64"> {
    return new Field("uint64");
  },

  float32(): Field<"float32"> {
    return new Field("float32");
  },

  stringOf(type: string): StringOfField {
    return new StringOfField(type);
  },

  map<K extends Field<"string">, V extends Field<FieldType>>(
    keyType: K,
    valueType: V
  ): MapField<K, V> {
    return new MapField(keyType, valueType);
  },
};
