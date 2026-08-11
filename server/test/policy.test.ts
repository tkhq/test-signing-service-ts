import { describe, expect, it } from "vitest";
import { checkPolicy } from "../src/policy.js";

describe("checkPolicy", () => {
  const cases: Array<{ name: string; walletId: string; payload: string; reject: boolean }> = [
    { name: "ok", walletId: "wallet-alpha", payload: "x", reject: false },
    { name: "empty payload", walletId: "wallet-alpha", payload: "", reject: true },
    { name: "empty wallet", walletId: "", payload: "x", reject: true },
    { name: "not allow-listed", walletId: "wallet-zzz", payload: "x", reject: true },
  ];

  for (const tc of cases) {
    it(tc.name, () => {
      const reason = checkPolicy({ walletId: tc.walletId, payload: tc.payload });
      if (tc.reject) expect(reason).not.toBe("");
      else expect(reason).toBe("");
    });
  }
});
