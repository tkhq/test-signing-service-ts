// SigningRequest is a request to sign a payload for a given wallet.
export interface SigningRequest {
  id: string;
  walletId: string;
  payload: string;
  status: string; // "SIGNED" | "REJECTED"
  signature: string; // populated when SIGNED
}

// CreateRequest is the JSON body for POST /v1/signing-requests.
export interface CreateRequest {
  walletId: string;
  payload: string;
}

// ErrorResponse is the JSON body returned for non-2xx responses.
export interface ErrorResponse {
  error: string;
}
