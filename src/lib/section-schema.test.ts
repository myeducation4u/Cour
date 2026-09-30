import assert from "node:assert/strict";
import { test } from "node:test";
import { serializeSectionContent } from "./section-schema.ts";

test("hero content accepts canonical fields", () => {
  const out = serializeSectionContent(
    "hero",
    JSON.stringify({ established: "EST. 2022", leftTitle: "ENGINEERED FOR MOTION." }),
  );
  assert.equal(JSON.parse(out).established, "EST. 2022");
});

test("hero content rejects unknown keys and invalid JSON", () => {
  assert.throws(() => serializeSectionContent("hero", "{"));
  assert.throws(() => serializeSectionContent("hero", JSON.stringify({ extra: true })));
});

test("details content requires spec shape", () => {
  assert.throws(() =>
    serializeSectionContent("details", JSON.stringify({ specs: [{ id: "01" }] })),
  );
  const ok = serializeSectionContent(
    "details",
    JSON.stringify({ specs: [{ id: "01", title: "SHELL", body: "Protects." }] }),
  );
  assert.equal(JSON.parse(ok).specs[0].title, "SHELL");
});
