import { createHash } from "node:crypto";
import { setTimeout as sleep } from "node:timers/promises";

// sign is a STUB signer. It does not do real cryptography — it returns a
// deterministic fake "signature" derived from the wallet and payload so the
// rest of the system has something to store and display.
//
// The real signer runs inside a hardware enclave, and a signing round-trip
// takes on the order of hundreds of milliseconds. The stub sleeps to match,
// so latency behaves roughly like production.
//
// Do not treat this as secure. It exists only to stand in for the real signer.
export async function sign(walletId: string, payload: string): Promise<string> {
  await sleep(200);
  const sum = createHash("sha256").update(`${walletId}:${payload}`).digest("hex");
  return `sig_${sum.slice(0, 32)}`;
}
