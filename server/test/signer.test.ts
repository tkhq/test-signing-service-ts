import { describe, expect, it } from "vitest";
import { sign } from "../src/signer.js";

describe("sign", () => {
  it("returns a deterministic fake signature", async () => {
    const a = await sign("wallet-alpha", "hello");
    const b = await sign("wallet-alpha", "hello");
    expect(a).toBe(b);
    expect(a).toMatch(/^sig_[0-9a-f]{32}$/);
    expect(await sign("wallet-alpha", "other")).not.toBe(a);
  });
});
