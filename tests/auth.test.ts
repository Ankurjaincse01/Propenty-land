import test from "node:test";
import assert from "node:assert/strict";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-key";

test("signToken / verifyToken round-trips the payload", async () => {
  const auth = await import("../lib/auth");
  const token = auth.signToken({
    userId: "6512a1f2c3d4e5f6a7b8c9d0",
    email: "admin@greenlandestates.com",
    role: "admin",
  });
  assert.ok(token.split(".").length === 3, "expected a JWT with 3 segments");

  const payload = auth.verifyToken(token);
  assert.equal(payload.userId, "6512a1f2c3d4e5f6a7b8c9d0");
  assert.equal(payload.role, "admin");
});

test("verifyToken rejects a tampered token", async () => {
  const auth = await import("../lib/auth");
  const token = auth.signToken({ userId: "u1", email: "a@b.com", role: "admin" });
  const tampered = token.slice(0, -2) + "xx";
  assert.throws(() => auth.verifyToken(tampered));
});

test("hashPassword / comparePassword behaves correctly", async () => {
  const auth = await import("../lib/auth");
  const hash = await auth.hashPassword("ChangeMe@123");
  assert.notEqual(hash, "ChangeMe@123");
  assert.equal(await auth.comparePassword("ChangeMe@123", hash), true);
  assert.equal(await auth.comparePassword("wrong-password", hash), false);
});
