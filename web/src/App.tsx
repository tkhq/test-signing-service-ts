import { useEffect, useState } from "react";
import { listRequests, submitRequest, type NewRequest, type SigningRequest } from "./api";
import { RequestForm } from "./RequestForm";
import { RequestList } from "./RequestList";

export function App() {
  const [requests, setRequests] = useState<SigningRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setRequests(await listRequests());
    } catch (e) {
      setError((e as Error).message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleSubmit(input: NewRequest) {
    setError(null);
    try {
      await submitRequest(input);
      await refresh();
    } catch (e) {
      setError((e as Error).message);
    }
  }

  // Retry re-submits the same wallet + payload.
  function handleRetry(req: SigningRequest) {
    handleSubmit({ walletId: req.walletId, payload: req.payload });
  }

  return (
    <main>
      <h1>Signing Service</h1>
      <p className="sub">Submit a payload to sign. Requests run through a policy check, then the signer.</p>
      <RequestForm onSubmit={handleSubmit} />
      {error && <p className="error">{error}</p>}
      <RequestList requests={requests} onRetry={handleRetry} />
    </main>
  );
}
