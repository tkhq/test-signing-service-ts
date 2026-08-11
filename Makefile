.PHONY: dev server web test check install

# Run backend (:8080) and frontend (:5173) together.
dev:
	@echo "Starting backend on :8080 and frontend on :5173..."
	@trap 'kill 0' EXIT; \
	  (cd server && npm run dev) & \
	  (cd web && npm run dev) & \
	  wait

# Run just the backend.
server:
	cd server && npm run dev

# Run just the frontend dev server.
web:
	cd web && npm run dev

# Install backend and frontend dependencies.
install:
	cd server && npm install
	cd web && npm install

# Run backend tests.
test:
	cd server && npm test

# Run backend tests and typecheck both halves.
check: test
	cd server && npm run typecheck
	cd web && npm run typecheck
