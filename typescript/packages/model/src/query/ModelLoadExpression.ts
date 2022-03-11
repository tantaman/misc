import Model from "../Model";
import Schema from "../schema/Schema";
import { DerivedExpression } from "./Expression";

export class ModelLoadExpression
  implements DerivedExpression<StorageResult, Model>
{
  readonly type = "modelLoad";
  // converts from a raw payload (e.g., dict) and schema to a model instance.
  constructor(private schema: Schema) {}

  chainAfter() {
    // find the model class from the schema
    // instantiate it with our dict of stuff
  }
}
