import Schema from "../schema/Schema.js";

export interface FieldGetter<Tm, Tv> {
  readonly get: (Tm) => Tv;
}

export class ModelFieldGetter<Tm, Tv> implements FieldGetter<Tm, Tv> {
  constructor(
    public readonly schema: Schema,
    public readonly fieldName: string | null
  ) {}

  get(model: Tm): Tv {
    throw new Error();
  }
}
