import { NodoraClient } from "@nodora/client";

export const nodora = new NodoraClient({
  apiKey: process.env.NODORA_API_KEY!,
  env: "production",
  strategy: { type: "stale-while-revalidate", ttl: 60_000 },
});

export const checkout = nodora.ruleset("Checkout");
