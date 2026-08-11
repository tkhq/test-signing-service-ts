import type { SigningRequest } from "./types.js";

// Store persists signing requests. Methods are async to mirror a real,
// database-backed implementation.
export interface Store {
  save(req: SigningRequest): Promise<void>;
  get(id: string): Promise<SigningRequest | undefined>;
  list(): Promise<SigningRequest[]>;
}

// MemStore is a simple in-memory Store. Map iteration order preserves
// insertion order for list().
export class MemStore implements Store {
  private byId = new Map<string, SigningRequest>();

  async save(req: SigningRequest): Promise<void> {
    this.byId.set(req.id, req);
  }

  async get(id: string): Promise<SigningRequest | undefined> {
    return this.byId.get(id);
  }

  async list(): Promise<SigningRequest[]> {
    return [...this.byId.values()];
  }
}
