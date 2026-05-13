import { createHash, randomInt } from "node:crypto";

export function hashValue(value: string) {
  return createHash("sha256").update(`${process.env.PHONE_HASH_SALT ?? "dev_salt"}:${value}`).digest("hex");
}

export function encryptValue(value: string) {
  return Buffer.from(value, "utf8").toString("base64");
}

export function publicCode() {
  return String(randomInt(10_000_000, 99_999_999));
}

export function orderNo() {
  const date = new Date();
  const stamp = date.toISOString().slice(0, 10).replace(/-/g, "");
  return `KO${stamp}${randomInt(100000, 999999)}`;
}
