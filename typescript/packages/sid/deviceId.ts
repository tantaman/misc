import { nullthrows } from "@strut/utils";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

async function genVisitorId() {
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  return result.visitorId;
}

let cachedVisitorId: string | null = null;
export async function init() {
  if (cachedVisitorId != null) {
    throw new Error("Startup already invoked");
  }
  // Call fingerprint
  cachedVisitorId = await genVisitorId();
}

export default function deviceId(): string {
  return nullthrows(cachedVisitorId);
}
