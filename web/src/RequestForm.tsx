import { useState } from "react";
import type { NewRequest } from "./api";

const WALLETS = ["wallet-alpha", "wallet-beta", "wallet-gamma"];

export function RequestForm({ onSubmit }: { onSubmit: (req: NewRequest) => void }) {
  const [walletId, setWalletId] = useState(WALLETS[0]);
  const [payload, setPayload] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!payload.trim()) return;
    onSubmit({ walletId, payload });
    setPayload("");
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <select value={walletId} onChange={(e) => setWalletId(e.target.value)}>
        {WALLETS.map((w) => (
          <option key={w} value={w}>
            {w}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="payload to sign"
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
      />
      <button type="submit">Sign</button>
    </form>
  );
}
