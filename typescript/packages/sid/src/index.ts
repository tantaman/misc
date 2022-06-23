import { assertUnreachable, invariant, isHex } from "@strut/utils";

export { default as deviceId } from "./deviceId.js";

// https://github.com/seancroach/ts-opaque
export type Opaque<BaseType, BrandType = unknown> = BaseType & {
  readonly [Symbols.base]: BaseType;
  readonly [Symbols.brand]: BrandType;
};

namespace Symbols {
  /**
   * `base` is a unique symbol to be used as a property key in opaque types where
   * said opaque type's underlying base type is stored.
   *
   * *Note:* At runtime, `base` does not exist. ***Do not use `base` as a runtime
   * value.***
   */
  export declare const base: unique symbol;

  /**
   * `brand` is a unique symbol to be used as a property key in opaque types
   * where said opaque type's brand is stored.
   *
   * *Note:* At runtime, `brand` does not exist. ***Do not use `brand` as a
   * runtime value.***
   */
  export declare const brand: unique symbol;
}

export type SID_of<T> = Opaque<string, T>;
export type BID_of<T> = Opaque<BigInt, T>;
export type DeviceId = string;

// 32 bit random var in decimal
let randomVariable = Math.floor(Number.MAX_SAFE_INTEGER * Math.random());

/**
 * Creates a 64 bit ID that monotonically increases.
 * Returns a hex string given that JS does not support 64bit ints.
 * Guaranteed to be unique on the given device.
 *
 * @param deviceId hex string representing the device.
 * @param base should the returned string be a hex or decimal representation of a 64bit int?
 * @returns
 */
export default function sid<T>(
  deviceId: DeviceId,
  base: "hex" | "decimal" = "decimal"
): SID_of<T> {
  invariant(isHex(deviceId), "Device ID must be a hex string");
  invariant(deviceId.length >= 4, "Device ids must be at least 2 bytes");

  // 32 bits, hex
  const hi32 = Math.floor(Date.now() / 1000).toString(16);

  // low 16 bits of device, in hex
  const partialDevice = deviceId.substring(deviceId.length - 4);
  // low 16 bits of the random variable, in hex
  const random = (++randomVariable & 0xffff).toString(16);

  const low32 = partialDevice + random;
  const hex = (hi32 + low32) as SID_of<T>;

  if (base === "hex") {
    return hex;
  }

  if (base === "decimal") {
    return BigInt("0x" + hex).toString() as SID_of<T>;
  }

  assertUnreachable(base);
}

export function asId<T>(id: string): SID_of<T> {
  return id as SID_of<T>;
}

export function truncateForDisplay(id: string) {
  return id.substring(id.length - 6);
}

// const max = 2n ** 64n - 1n;
// BigInt.asUintN(64, max);

/*
(Seconds since January 1st 1970) << 32
+ (lower 2 bytes of the wifi MAC address) << 16
+ 16_bits_unsigned_int++;
*/

// Based on short_uuid proposal
// https://www.percona.com/blog/2019/11/22/uuids-are-popular-but-bad-for-performance-lets-discuss/
// https://dev.mysql.com/doc/refman/5.6/en/miscellaneous-functions.html#function_uuid-short

// prefixed with timestamp to allow fast range queries and to keep things in order in the index.
// mysql approach of prefixing server id would help with sharding if ever we get there.
