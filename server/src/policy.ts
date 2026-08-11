import type { CreateRequest } from "./types.js";

// allowedWallets is the trivial allow-list the policy check enforces.
// In the real system this would be a full policy engine; here it is just
// enough to give the request a meaningful gate.
const allowedWallets = new Set(["wallet-alpha", "wallet-beta", "wallet-gamma"]);

// checkPolicy returns a non-empty reason string if the request should be
// rejected, or "" if it is allowed to proceed to signing.
export function checkPolicy(req: CreateRequest): string {
  if (req.walletId === "") {
    return "walletId is required";
  }
  if (req.payload === "") {
    return "payload is required";
  }
  if (!allowedWallets.has(req.walletId)) {
    return "walletId is not allow-listed";
  }
  return "";
}
