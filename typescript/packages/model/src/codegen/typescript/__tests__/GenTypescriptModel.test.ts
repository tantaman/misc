import GenTypescriptModel from "../GenTypescriptModel.js";
import { Node } from "../../../schema/parser/SchemaType.js";
import { compileFromString } from "../../../schema/v2/compile.js";

const IDOnlySchema = `
engine: postgres
db: test

Node<IDOnly> {
  id: ID<IDOnly>
}
`;

const PrimitiveFieldsSchema = `
engine: postgres
db: test

Node<PrimitiveFields> {
  id: ID<PrimitiveFields>
  mrBool: bool
  mrInt32: int32
  mrInt64: int64
  mrUint: uint64
  mrFloat: float32
  mrString: string
}
`;

test("Generating an ID only model", () => {
  const contents = genIt(
    compileFromString(IDOnlySchema)[1].nodes.IDOnly
  ).contents;
  expect(contents).toEqual(
    `// SIGNED-SOURCE: <af8ef89465f19699d3ac1e3cf8a14efb>
import Model, { Spec } from "@strut/model/Model.js";
import { SID_of } from "@strut/sid";

export type Data = {
  id: SID_of<any>;
};

export default class IDOnly extends Model<Data> {
  get id(): SID_of<any> {
    return this.data.id;
  }
}

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new IDOnly(data);
  },

  storageDescriptor: {
    engine: "postgres",
    db: "test",
    type: "sql",
    tablish: "idonly",
  },
};
`
  );
});

test("Generating all primitive fields", () => {
  const contents = genIt(
    compileFromString(PrimitiveFieldsSchema)[1].nodes.PrimitiveFields
  ).contents;
  expect(contents).toEqual(`// SIGNED-SOURCE: <938a3bbdaa7018a4f08e45ebf39dbe59>
import Model, { Spec } from "@strut/model/Model.js";
import { SID_of } from "@strut/sid";

export type Data = {
  id: SID_of<any>;
  mrBool: boolean;
  mrInt32: number;
  mrInt64: string;
  mrUint: string;
  mrFloat: number;
  mrString: string;
};

export default class PrimitiveFields extends Model<Data> {
  get id(): SID_of<any> {
    return this.data.id;
  }

  get mrBool(): boolean {
    return this.data.mrBool;
  }

  get mrInt32(): number {
    return this.data.mrInt32;
  }

  get mrInt64(): string {
    return this.data.mrInt64;
  }

  get mrUint(): string {
    return this.data.mrUint;
  }

  get mrFloat(): number {
    return this.data.mrFloat;
  }

  get mrString(): string {
    return this.data.mrString;
  }
}

export const spec: Spec<Data> = {
  createFrom(data: Data) {
    return new PrimitiveFields(data);
  },

  storageDescriptor: {
    engine: "postgres",
    db: "test",
    type: "sql",
    tablish: "primitivefields",
  },
};
`);
});

function genIt(schema: Node) {
  return new GenTypescriptModel(schema).gen();
}
