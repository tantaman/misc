export default function maybeMap<Tp, Tr>(
  vals: Iterable<Tp>,
  fn: (Tp) => Tr
): Tr[] {
  const ret: Tr[] = [];
  for (const v of vals) {
    const mapped = fn(v);
    if (mapped != null) {
      ret.push(mapped);
    }
  }
  return ret;
}
