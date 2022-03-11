export default class FieldAndEdgeBase {
  decorators: readonly string[] = [];
  isUnique: boolean;
  name: string;
  description: string;

  decorator(...v: string[]): this {
    this.decorators = this.decorators.concat(v);
    return this;
  }

  unique(value: boolean = true): this {
    this.isUnique = true;
    return this;
  }
}
