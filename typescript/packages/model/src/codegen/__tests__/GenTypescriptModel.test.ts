import GenTypescriptModel from "../../codegen/GenTypescriptModel.js";
import Field from "../../schema/Field.js";
import Schema from "../../schema/Schema.js";

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
      mrBool: Field.bool(),
      mrString: Field.stringOf("string"),
      mrInt32: Field.int32(),
      mrInt64: Field.int64(),
      mrUint64: Field.uint64(),
      mrFloat: Field.float32(),
    };
  }
}

test("Generating an ID only model", () => {
  expect(genIt(IDOnlySchema.get()).contents).toEqual(
    `import Model from '@strut/model/Model.js';
import {SID_of} from '@strut/sid';


export type Data = {
  id: SID_of<any>
};


export default class IDOnly
  extends Model<Data> {
    
  get id(): SID_of<any> {
    return this.data.id;
  }

  
}


export const spec = {
  createFrom(data: Data) {
    return new IDOnly(data);
  },

  nativeStorageType: "MySQL",
}

`
  );
});

test("Generating all primitive fields", () => {
  console.log(genIt(PrimitiveFieldsSchema.get()).contents);
  expect(genIt(PrimitiveFieldsSchema.get()).contents)
    .toEqual(`import Model from '@strut/model/Model.js';
import {SID_of} from '@strut/sid';


export type Data = {
  mrBool: boolean,
  mrString: string,
  mrInt32: number,
  mrInt64: string,
  mrUint64: string,
  mrFloat: number
};


export default class PrimitiveFields
  extends Model<Data> {
    
  get mrBool(): boolean {
    return this.data.mrBool;
  }

  
  get mrString(): string {
    return this.data.mrString;
  }

  
  get mrInt32(): number {
    return this.data.mrInt32;
  }

  
  get mrInt64(): string {
    return this.data.mrInt64;
  }

  
  get mrUint64(): string {
    return this.data.mrUint64;
  }

  
  get mrFloat(): number {
    return this.data.mrFloat;
  }

  
}


export const spec = {
  createFrom(data: Data) {
    return new PrimitiveFields(data);
  },

  nativeStorageType: "MySQL",
}

`);
});

function genIt(schema: Schema) {
  return new GenTypescriptModel(schema).gen();
}
