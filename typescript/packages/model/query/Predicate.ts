// inverse of predicate
// in set of prediate
// binary predicate?
// case sensitivity?

export interface Predicate<Tv> {
  call(Tv): boolean;
}

export class Equal<Tv> implements Predicate<Tv> {
  constructor(private value: Tv) {}

  call(what: Tv): boolean {
    return what === this.value;
  }

  invert(): NotEqual<Tv> {
    return new NotEqual(this.value);
  }
}

export class NotEqual<Tv> implements Predicate<Tv> {
  constructor(private value: Tv) {}

  call(what: Tv): boolean {
    return what !== this.value;
  }

  invert(): Equal<Tv> {
    return new Equal(this.value);
  }
}
