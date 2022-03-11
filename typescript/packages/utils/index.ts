import invariant from "./src/invariant";
import * as math from "./src/math";
import notEmpty from "./src/notEmpty";
import nullthrows from "./src/nullthrows";
import typedKeys from "./src/typedKeys_UNSAFE";
import memoize from "./src/memoize";
import asString from "./src/asString";
import debounce from "./src/debounce";
import keyById from "./src/keyById";
import readAndParse from "./src/readAndParse";
import stripSuffix from "./src/stripSuffix";
import select from "./src/select";
import upcaseAt from "./src/upcaseAt";
import assertUnreahable from "./src/assertUnreachable";
import only from "./src/only";

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
