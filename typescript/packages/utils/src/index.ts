import invariant from "./invariant.js";
import * as math from "./math.js";
import notEmpty from "./notEmpty.js";
import nullthrows from "./nullthrows.js";
import typedKeys from "./typedKeys_UNSAFE.js";
import memoize from "./memoize.js";
import asString from "./asString.js";
import debounce from "./debounce.js";
import keyById from "./keyById.js";
import readAndParse from "./readAndParse.js";
import stripSuffix from "./stripSuffix.js";
import select from "./select.js";
import upcaseAt from "./upcaseAt.js";
import assertUnreahable from "./assertUnreachable.js";
import only from "./only.js";
import maybeMap from "./maybeMap.js";

export type Concat<T, S, V> = string;

function falsish(x: any): boolean {
  return !!x === false;
}

function isValidPropertyAccessor(a: string): boolean {
  return (a.match(/[A-z_$]+[A-z0-9_$]*/) || [])[0] === a;
}

function not(x) {
  return !x;
}

export {
  invariant,
  math,
  notEmpty,
  nullthrows,
  typedKeys,
  memoize,
  asString,
  debounce,
  keyById,
  readAndParse,
  stripSuffix,
  select,
  upcaseAt,
  assertUnreahable,
  falsish,
  isValidPropertyAccessor,
  not,
  only,
  maybeMap,
};
