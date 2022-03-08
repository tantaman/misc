export interface FieldGetter<Tm, Tv> {
  readonly get: (Tm) => Tv;
}

export class ModelFieldGetter<Tm, Tv> implements FieldGetter<Tm, Tv> {
  constructor(
    public readonly fieldName: string | null,
    public readonly get: (Tm) => Tv
  ) {}
}
