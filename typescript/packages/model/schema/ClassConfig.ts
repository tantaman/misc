export default class ClassConfig {
  decorators: readonly string[] = [];

  decorator(...v: string[]): this {
    this.decorators = this.decorators.concat(v);
    return this;
  }
}
