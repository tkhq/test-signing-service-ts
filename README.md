# Signing Service

A small full-stack service that accepts **signing requests**, runs them through a
policy check, and returns a signed result. It models a real flow:
*coordinator → policy → signer*, in miniature. The "signer" is a stub: it
returns a deterministic fake signature, not real cryptography. You do **not**
need any blockchain or crypto knowledge to work on this.

- **Backend:** TypeScript Node service (`server/`, Express), in-memory storage.
- **Frontend:** React + TypeScript via Vite (`web/`); a one-screen dashboard to
  submit requests and view results.

## Running it

You'll need Node (20+).

```bash
make install   # installs backend + frontend deps (one time)
make dev       # runs backend on :8080 and frontend on :5173
```

Then open http://localhost:5173.

Other targets: `make server`, `make web`, `make test` (backend tests), and
`make check` (backend tests + typechecks) — the quickest way to verify the
whole stack after a change.

## API

| Method | Path | Description |
|---|---|---|
| `POST` | `/v1/signing-requests` | Create a signing request. Body: `{ "walletId": string, "payload": string }`. Returns the signed request. |
| `GET` | `/v1/signing-requests` | List all requests. |
| `GET` | `/v1/signing-requests/{id}` | Fetch one request, or `404`. |

Allow-listed wallets: `wallet-alpha`, `wallet-beta`, `wallet-gamma`. The policy
check rejects empty payloads, empty wallet IDs, and wallets that aren't
allow-listed (`422`).

```bash
curl -s localhost:8080/v1/signing-requests \
  -H 'Content-Type: application/json' \
  -d '{"walletId":"wallet-alpha","payload":"hello"}'
```

---

## Before your interview

Please confirm the service runs on your machine: `make install`, then
`make dev`, then open http://localhost:5173 and submit a request. If anything
fails to boot, let us know ahead of the session so we can sort it out off the
clock.

You'll receive the task itself at the start of the interview.
