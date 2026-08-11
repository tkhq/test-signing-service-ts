import express from "express";
import { randomBytes } from "node:crypto";
import { checkPolicy } from "./policy.js";
import { sign } from "./signer.js";
import type { Store } from "./store.js";
import type { CreateRequest, SigningRequest } from "./types.js";

// createApp wires up the HTTP routes and middleware.
export function createApp(store: Store): express.Express {
  const app = express();
  app.use(cors);
  app.use(express.json());

  // Create a new signing request: policy check -> sign -> store.
  app.post("/v1/signing-requests", async (req, res) => {
    const body: CreateRequest = {
      walletId: typeof req.body?.walletId === "string" ? req.body.walletId : "",
      payload: typeof req.body?.payload === "string" ? req.body.payload : "",
    };

    const reason = checkPolicy(body);
    if (reason !== "") {
      res.status(422).json({ error: reason });
      return;
    }

    const request: SigningRequest = {
      id: newId(),
      walletId: body.walletId,
      payload: body.payload,
      status: "SIGNED",
      signature: await sign(body.walletId, body.payload),
    };
    await store.save(request);

    res.status(201).json(request);
  });

  // List all signing requests, newest last.
  app.get("/v1/signing-requests", async (_req, res) => {
    res.status(200).json(await store.list());
  });

  // Fetch a single signing request by ID.
  app.get("/v1/signing-requests/:id", async (req, res) => {
    const request = await store.get(req.params.id);
    if (request === undefined) {
      res.status(404).json({ error: "signing request not found" });
      return;
    }
    res.status(200).json(request);
  });

  app.use(jsonErrors);
  return app;
}

function newId(): string {
  return `req_${randomBytes(12).toString("hex")}`;
}

// cors allows the Vite dev server to call the API directly.
function cors(req: express.Request, res: express.Response, next: express.NextFunction): void {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Idempotency-Key");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
}

// jsonErrors maps body-parse failures to the API's 400 error shape.
function jsonErrors(
  err: unknown,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
): void {
  if (err !== null && typeof err === "object" && (err as { type?: string }).type === "entity.parse.failed") {
    res.status(400).json({ error: "invalid JSON body" });
    return;
  }
  next(err);
}
