import test from "node:test";
import assert from "node:assert/strict";
import worker from "../src/index.js";

const origin = "https://clever-moreira.github.io";
const url = "https://example.workers.dev/api/chat";
function req({ originValue = origin, contentType = "application/json", method = "POST" } = {}) {
  return new Request(url, { method, headers: { Origin: originValue, "content-type": contentType, "cf-connecting-ip": "198.51.100.12" }, body: method === "POST" ? JSON.stringify({ messages: [{ role: "user", content: "Oi" }] }) : undefined });
}
function env(allowed = true) {
  const limit = { limit: async () => ({ success: allowed }) };
  return { CHAT_RATE_LIMITER: limit, CHAT_GLOBAL_LIMITER: limit, AI: { run: async () => ({ response: "Olá" }) } };
}
test("rejects inference when protection binding is missing", async () => {
  const res = await worker.fetch(req(), { AI: env().AI });
  assert.equal(res.status, 503);
  assert.equal((await res.json()).error, "security_configuration_missing");
});
test("rejects calls exceeding rate limit before invoking AI", async () => {
  let called = 0;
  const e = env(false);
  e.AI.run = async () => { called++; return { response: "not expected" }; };
  const res = await worker.fetch(req(), e);
  assert.equal(res.status, 429);
  assert.equal(called, 0);
});
test("rejects content types other than JSON", async () => {
  const res = await worker.fetch(req({ contentType: "text/plain" }), env());
  assert.equal(res.status, 415);
});
test("allows legitimate JSON request under limit", async () => {
  const res = await worker.fetch(req(), env());
  assert.equal(res.status, 200);
  assert.equal((await res.json()).answer, "Olá");
});
test("blocks requests from unapproved browser origins", async () => {
  const res = await worker.fetch(req({ originValue: "https://untrusted.example" }), env());
  assert.equal(res.status, 403);
});
test("fails closed if rate-limit service throws", async () => {
  const e = env();
  e.CHAT_RATE_LIMITER.limit = async () => { throw new Error("unavailable"); };
  const res = await worker.fetch(req(), e);
  assert.equal(res.status, 503);
});
