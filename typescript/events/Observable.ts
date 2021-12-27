export type Disposer = () => void;

export default class CObservable<T> {
  private _subscriptions: Set<(p: T) => void> = new Set();

  observe(c: (p: T) => void): Disposer {
    this._subscriptions.add(c);
    return () => this._subscriptions.delete(c);
  }

  protected notify(p: T) {
    for (const c of this._subscriptions) {
      c(p);
    }
  }
}
