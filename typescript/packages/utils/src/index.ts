import invariant from "./invariant";
import * as math from "./math";
import notEmpty from "./notEmpty";
import nullthrows from "./nullthrows";
import typedKeys from "./typedKeys_UNSAFE";
import memoize from "./memoize";
import asString from "./asString";
import debounce from "./debounce";
import keyById from "./keyById";
import readAndParse from "./readAndParse";
import stripSuffix from "./stripSuffix";
import select from "./select";
import upcaseAt from "./upcaseAt";
import assertUnreahable from "./assertUnreachable";
import only from "./only";

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
};
