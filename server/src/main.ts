import { createApp } from "./handlers.js";
import { MemStore } from "./store.js";

const port = Number(process.env.PORT ?? 8080);

createApp(new MemStore()).listen(port, () => {
  console.log(`signing-service listening on :${port}`);
});
