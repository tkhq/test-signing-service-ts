import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev server proxies API calls to the backend on :8080, so the frontend
// can use same-origin relative URLs like "/v1/signing-requests".
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/v1": "http://localhost:8080",
    },
  },
});
