import { Spec, IModel } from "../Model.js";
import Schema from "../schema/Schema.js";

export interface FieldGetter<Tm, Tv> {
  readonly get: (Tm) => Tv;
}

export class ModelFieldGetter<Td, Tm extends IModel<Td>, Tv>
  implements FieldGetter<Tm, Tv>
{
  constructor(
    public readonly spec: Spec<Td>,
    public readonly fieldName: string | null
  ) {}

  get(model: Tm): Tv {
    throw new Error();
  }
}
