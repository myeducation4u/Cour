import assert from "node:assert/strict";
import { test } from "node:test";
import { decodeFrame } from "./decode-seed.ts";

test("decodeFrame is deterministic per token and frame", () => {
  const a = decodeFrame("ENGINEERED FOR MOTION.", 4);
  const b = decodeFrame("ENGINEERED FOR MOTION.", 4);
  assert.equal(a, b);
  assert.notEqual(a, decodeFrame("ENGINEERED FOR MOTION.", 3));
});

test("decodeFrame resolves to the source text", () => {
  assert.equal(decodeFrame("BUILT TO ENDURE.", 14), "BUILT TO ENDURE.");
});
