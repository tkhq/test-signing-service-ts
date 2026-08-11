import type { SigningRequest } from "./api";

export function RequestList({
  requests,
  onRetry,
}: {
  requests: SigningRequest[];
  onRetry: (req: SigningRequest) => void;
}) {
  if (requests.length === 0) {
    return <p className="empty">No signing requests yet.</p>;
  }

  return (
    <table className="request-list">
      <thead>
        <tr>
          <th>Wallet</th>
          <th>Payload</th>
          <th>Status</th>
          <th>Signature</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {requests
          .slice()
          .reverse()
          .map((req) => (
            <tr key={req.id}>
              <td>{req.walletId}</td>
              <td className="payload">{req.payload}</td>
              <td>{req.status}</td>
              <td className="sig">{req.signature}</td>
              <td>
                <button onClick={() => onRetry(req)}>Retry</button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
