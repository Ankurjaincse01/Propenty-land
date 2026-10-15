import test from "node:test";
import assert from "node:assert/strict";
import {
  formatIndianNumber,
  formatPriceShort,
  formatPrice,
  convertArea,
  formatArea,
  slugify,
  generateWhatsAppUrl,
  truncate,
} from "../lib/utils";

test("formatIndianNumber uses the Indian grouping system", () => {
  assert.equal(formatIndianNumber(1450000), "₹14,50,000");
  assert.equal(formatIndianNumber(999), "₹999");
  assert.equal(formatIndianNumber(NaN), "₹0");
});

test("formatPriceShort renders Lakhs and Crores", () => {
  assert.equal(formatPriceShort(1850000), "₹18.50 Lakhs");
  assert.equal(formatPriceShort(12500000), "₹1.25 Cr");
  assert.equal(formatPriceShort(0), "Price on request");
  assert.equal(formatPrice(12500000, { short: true }), "₹1.25 Cr");
  assert.equal(formatPrice(1450000), "₹14,50,000");
});

test("convertArea converts between Indian land units", () => {
  assert.equal(convertArea(1, "acre", "sq.ft"), 43560);
  assert.equal(convertArea(1, "sq.yd", "sq.ft"), 9);
  assert.equal(convertArea(1, "guntha", "sq.ft"), 1089);
  // round trip within tolerance
  const back = convertArea(convertArea(1, "acre", "guntha"), "guntha", "acre");
  assert.ok(Math.abs(back - 1) < 1e-9);
});

test("formatArea applies sensible decimals per unit", () => {
  assert.equal(formatArea(1200, "sq.ft"), "1200 sq.ft");
  assert.equal(formatArea(1.5, "acre"), "1.500 acre");
});

test("slugify produces URL-safe slugs", () => {
  assert.equal(slugify("Hello World! Plot #1"), "hello-world-plot-1");
  assert.equal(slugify("  East-Facing   Plot  "), "east-facing-plot");
});

test("generateWhatsAppUrl strips non-digits and encodes the message", () => {
  assert.equal(
    generateWhatsAppUrl("+91 98765 43210", "Hi there"),
    "https://wa.me/919876543210?text=Hi%20there"
  );
});

test("truncate appends an ellipsis only when needed", () => {
  assert.equal(truncate("short", 10), "short");
  assert.equal(truncate("0123456789ABCDEF", 10), "0123456789…");
});
