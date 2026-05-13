export function calculateDeposit(totalPriceCents: number, rate = 0.5) {
  assertCents(totalPriceCents);
  const depositAmountCents = Math.round(totalPriceCents * rate);
  return {
    depositAmountCents,
    balanceAmountCents: totalPriceCents - depositAmountCents
  };
}

export function calculateCommission(totalPriceCents: number, commissionRate = 0.05) {
  assertCents(totalPriceCents);
  const commissionAmountCents = Math.round(totalPriceCents * commissionRate);
  return {
    commissionAmountCents,
    payoutAmountCents: totalPriceCents - commissionAmountCents
  };
}

export function formatCny(cents: number) {
  assertCents(cents);
  return `¥${(cents / 100).toFixed(2)}`;
}

export function assertCents(value: number) {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("Amount must be a non-negative integer in cents/fen.");
  }
}
