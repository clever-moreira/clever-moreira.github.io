import test from "node:test";
import assert from "node:assert/strict";
import { conversationRoute, PROJECTS } from "../src/dialogue.js";

const talk = (...questions) => questions.map(content => ({role:"user", content}));

test("Python is routed to resilient automation project", () => {
  const r=conversationRoute(talk("Ele trabalha com Python em RPA?"));
  assert.equal(r.topic,"rpa");
  assert.equal(r.projects[0].id,"rpa");
  assert.ok(r.suggestions.some(s=>s.includes("RPA") || s.includes("automações")));
});

test("ERP discussion recommends documented demo, not a customer project", () => {
  const r=conversationRoute(talk("Como ele integra SAP e Senior?"));
  assert.equal(r.topic,"erp");
  assert.equal(r.projects[0].title,"ERP Integration API");
  assert.ok(r.projects[0].url.includes("github.com/clever-moreira/"));
});

test("brief follow up keeps the previous subject", () => {
  const r=conversationRoute(talk("Como ele trabalha com Python?", "E isso na prática?"));
  assert.equal(r.topic,"rpa");
});

test("personal hobbies should not push unrelated labs", () => {
  const r=conversationRoute(talk("Ele também toca guitarra?"));
  assert.equal(r.topic,"pessoal");
  assert.deepEqual(r.projects,[]);
});

test("courtesy doesn't become a sales pitch", () => {
  const r=conversationRoute(talk("obrigado!"));
  assert.deepEqual(r.projects,[]);
  assert.deepEqual(r.suggestions,[]);
});

test("generic question suggests exploration without inventing project", () => {
  const r=conversationRoute(talk("Olá"));
  assert.equal(r.topic,"geral");
  assert.deepEqual(r.projects,[]);
  assert.equal(r.suggestions.length,2);
});

test("recommendations point only to public labs", () => {
  for (const project of Object.values(PROJECTS)) {
    assert.match(project.url,/^https:\/\/github\.com\/clever-moreira\/clever-moreira\.github\.io\/tree\/main\/labs\//);
  }
});

test("technology overview does not get misclassified as AI only", () => {
  const r=conversationRoute(talk("Fale sobre a experiência dele em tecnologia."));
  assert.equal(r.topic,"perfil");
});
test("follow-up suggestions rotate instead of repeating indefinitely", () => {
  const a=conversationRoute(talk("Como ele trabalha com Python?"));
  const b=conversationRoute(talk("Como ele trabalha com Python?", "E sobre Python na prática?"));
  assert.notDeepEqual(a.suggestions,b.suggestions);
});
