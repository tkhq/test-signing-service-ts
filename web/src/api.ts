export interface NewRequest {
  walletId: string;
  payload: string;
}

export interface SigningRequest {
  id: string;
  walletId: string;
  payload: string;
  status: string;
  signature: string;
}

const API = "/v1/signing-requests";

// Submit a new signing request.
//
// We already send an Idempotency-Key header, so retries *should* be safe
// once the backend honors it. (The backend ignores it for now.)
export async function submitRequest(input: NewRequest): Promise<SigningRequest> {
  const idempotencyKey = crypto.randomUUID();

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "request failed");
  }
  return res.json();
}

export async function listRequests(): Promise<SigningRequest[]> {
  const res = await fetch(API);
  if (!res.ok) throw new Error("failed to load requests");
  return res.json();
}
