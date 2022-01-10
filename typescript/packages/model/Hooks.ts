import { useEffect, useReducer } from "react";
import { IModel } from "./Model";
import counter from "@strut/counter";

const count = counter("model-infra/Hooks");
export function useSubscription<T extends IModel<any>>(m: T): T {
  const [tick, forceUpdate] = useReducer((x) => x + 1, 0);
  useEffect(() => {
    count.bump("useSubscription." + m.constructor.name);
    // subscribe returns a function which will dispose of the subscription
    return m.subscribe(() => forceUpdate());
  }, [m]);

  return m;
}

export function useQuery<T>(keys: (keyof T)[], m: IModel<T>): void {
  const [tick, forceUpdate] = useReducer((x) => x + 1, 0);
  count.bump("useQuery." + m.constructor.name);
  useEffect(() => {
    count.bump("keyed.subscription." + m.constructor.name);
    // subscribe returns a function which will dispose of the subscription
    return m.subscribeTo(keys, () => forceUpdate());
  }, [m]);
}
