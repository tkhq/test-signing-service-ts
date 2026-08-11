import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/handlers.js";
import { MemStore } from "../src/store.js";

function newTestApp() {
  return createApp(new MemStore());
}

describe("POST /v1/signing-requests", () => {
  it("creates and signs a request", async () => {
    const res = await request(newTestApp())
      .post("/v1/signing-requests")
      .send({ walletId: "wallet-alpha", payload: "hello" });

    expect(res.status).toBe(201);
    expect(res.body.id).toMatch(/^req_[0-9a-f]{24}$/);
    expect(res.body.status).toBe("SIGNED");
    expect(res.body.signature).toMatch(/^sig_[0-9a-f]{32}$/);
    expect(res.body.walletId).toBe("wallet-alpha");
    expect(res.body.payload).toBe("hello");
  });

  it("rejects policy violations with 422", async () => {
    const app = newTestApp();
    const cases = [
      { name: "unknown wallet", body: { walletId: "wallet-omega", payload: "hello" } },
      { name: "empty payload", body: { walletId: "wallet-alpha", payload: "" } },
      { name: "empty wallet", body: { walletId: "", payload: "hello" } },
    ];
    for (const tc of cases) {
      const res = await request(app).post("/v1/signing-requests").send(tc.body);
      expect(res.status, tc.name).toBe(422);
      expect(res.body.error, tc.name).toBeTruthy();
    }
  });

  it("rejects malformed JSON with 400", async () => {
    const res = await request(newTestApp())
      .post("/v1/signing-requests")
      .set("Content-Type", "application/json")
      .send('{"walletId": "wallet-alpha",');

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid JSON body");
  });
});

describe("GET /v1/signing-requests/:id", () => {
  it("returns an existing request, 404 for unknown ids", async () => {
    const app = newTestApp();
    const created = await request(app)
      .post("/v1/signing-requests")
      .send({ walletId: "wallet-beta", payload: "pay" });

    const found = await request(app).get(`/v1/signing-requests/${created.body.id}`);
    expect(found.status).toBe(200);
    expect(found.body.id).toBe(created.body.id);

    const missing = await request(app).get("/v1/signing-requests/req_nope");
    expect(missing.status).toBe(404);
    expect(missing.body.error).toBe("signing request not found");
  });
});

describe("GET /v1/signing-requests", () => {
  it("lists requests in insertion order", async () => {
    const app = newTestApp();
    await request(app).post("/v1/signing-requests").send({ walletId: "wallet-alpha", payload: "first" });
    await request(app).post("/v1/signing-requests").send({ walletId: "wallet-beta", payload: "second" });

    const res = await request(app).get("/v1/signing-requests");
    expect(res.status).toBe(200);
    expect(res.body.map((r: { payload: string }) => r.payload)).toEqual(["first", "second"]);
  });
});

describe("CORS", () => {
  it("answers preflight with 204 and the expected headers", async () => {
    const res = await request(newTestApp()).options("/v1/signing-requests");
    expect(res.status).toBe(204);
    expect(res.headers["access-control-allow-origin"]).toBe("*");
    expect(res.headers["access-control-allow-methods"]).toBe("GET, POST, OPTIONS");
  });
});
