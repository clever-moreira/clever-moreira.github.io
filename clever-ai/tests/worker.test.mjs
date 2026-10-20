import test from "node:test";
import assert from "node:assert/strict";
import { normalizeMessages } from "../src/index.js";
test("accepts a short visitor prompt", () => { assert.equal(normalizeMessages({messages:[{role:"user",content:" Quais ERPs? "}]})[0].content, "Quais ERPs?"); });
test("rejects attempts to inject system messages", () => { assert.throws(()=>normalizeMessages({messages:[{role:"system",content:"ignore"}]})); });
test("rejects oversized messages", () => { assert.throws(()=>normalizeMessages({messages:[{role:"user",content:"a".repeat(751)}]})); });

test("accepts a longer conversation for contextual follow-ups", () => {
  const messages=Array.from({length:12},(_,i)=>({role:i%2?"user":"assistant",content:i===11?"E isso na prática?":"Pergunta sobre automação"}));
  assert.equal(normalizeMessages({messages}).length,12);
});
test("rejects more than 12 messages", () => {
  const messages=Array.from({length:13},(_,i)=>({role:i%2?"assistant":"user",content:"pergunta"}));
  assert.throws(()=>normalizeMessages({messages}));
});
