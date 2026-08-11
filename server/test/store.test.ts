import { describe, expect, it } from "vitest";
import { MemStore } from "../src/store.js";
import type { SigningRequest } from "../src/types.js";

function req(id: string, overrides: Partial<SigningRequest> = {}): SigningRequest {
  return { id, walletId: "wallet-alpha", payload: "hello", status: "SIGNED", signature: "sig_x", ...overrides };
}

describe("MemStore", () => {
  it("saves and gets a request", async () => {
    const s = new MemStore();
    await s.save(req("req_1"));
    const got = await s.get("req_1");
    expect(got?.walletId).toBe("wallet-alpha");
    expect(got?.payload).toBe("hello");
  });

  it("returns undefined for a missing id", async () => {
    const s = new MemStore();
    expect(await s.get("nope")).toBeUndefined();
  });

  it("preserves insertion order; updates do not reorder or duplicate", async () => {
    const s = new MemStore();
    await s.save(req("a"));
    await s.save(req("b"));
    await s.save(req("a", { payload: "updated" }));
    const got = await s.list();
    expect(got.map((r) => r.id)).toEqual(["a", "b"]);
    expect(got[0].payload).toBe("updated");
  });
});
