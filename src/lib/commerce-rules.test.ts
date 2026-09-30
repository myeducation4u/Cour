import assert from "node:assert/strict";
import { test } from "node:test";
import {
  can,
  canTransitionOrder,
  clampInventory,
  clampQty,
  isHexColor,
  isSafeInternalHref,
  isSafeMediaUrl,
  isSlug,
  isValidEmail,
  sanitizeSearchTerm,
  shippingCents,
  stockAvailability,
} from "./commerce-rules.ts";

test("clampQty rejects non-finite and decimals", () => {
  assert.equal(clampQty(NaN), 0);
  assert.equal(clampQty(Infinity), 0);
  assert.equal(clampQty(-3), 0);
  assert.equal(clampQty(2.9), 2);
  assert.equal(clampQty(99), 8);
  assert.equal(clampQty("4"), 4);
});

test("clampInventory allows studio stock but not garbage", () => {
  assert.equal(clampInventory(40), 40);
  assert.equal(clampInventory(-1), 0);
  assert.equal(clampInventory(1e9), 9999);
});

test("shippingCents is server-authoritative", () => {
  assert.equal(shippingCents(0), 0);
  assert.equal(shippingCents(18000), 1800);
  assert.equal(shippingCents(40000), 0);
  assert.equal(shippingCents(52000), 0);
});

test("stockAvailability hides exact counts", () => {
  assert.equal(stockAvailability(0), "out");
  assert.equal(stockAvailability(2), "low");
  assert.equal(stockAvailability(10), "in");
});

test("href and media URL allowlists", () => {
  assert.equal(isSafeInternalHref("/shop"), true);
  assert.equal(isSafeInternalHref("javascript:alert(1)"), false);
  assert.equal(isSafeMediaUrl("/media/void-puffer.webp"), true);
  assert.equal(isSafeMediaUrl("https://cdn.example.com/a.jpg"), true);
  assert.equal(isSafeMediaUrl("data:text/html,hi"), false);
});

test("email, slug, hex, search sanitization", () => {
  assert.equal(isValidEmail("a@b.co"), true);
  assert.equal(isValidEmail("nope"), false);
  assert.equal(isSlug("void-puffer"), true);
  assert.equal(isSlug("../etc"), false);
  assert.equal(isHexColor("#12131A"), true);
  assert.equal(isHexColor("blue"), false);
  assert.equal(sanitizeSearchTerm("  %void_  "), "void");
});

test("permissions and order transitions", () => {
  assert.equal(can("editor", "content"), true);
  assert.equal(can("editor", "orders"), false);
  assert.equal(canTransitionOrder("placed", "confirmed"), true);
  assert.equal(canTransitionOrder("delivered", "placed"), false);
  assert.equal(canTransitionOrder("nope", "placed"), false);
});
