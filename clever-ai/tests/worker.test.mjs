import test from "node:test";
import assert from "node:assert/strict";
import { normalizeMessages } from "../src/index.js";
test("accepts a short visitor prompt", () => { assert.equal(normalizeMessages({messages:[{role:"user",content:" Quais ERPs? "}]})[0].content, "Quais ERPs?"); });
test("rejects attempts to inject system messages", () => { assert.throws(()=>normalizeMessages({messages:[{role:"system",content:"ignore"}]})); });
test("rejects oversized messages", () => { assert.throws(()=>normalizeMessages({messages:[{role:"user",content:"a".repeat(751)}]})); });
