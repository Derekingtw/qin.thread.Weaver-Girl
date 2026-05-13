import { z } from "zod";

export const phoneSchema = z.string().min(6).max(32);
export const otpSchema = z.string().regex(/^\d{6}$/);

export const createListingSchema = z.object({
  title: z.string().min(2).max(80),
  description: z.string().min(10).max(5000),
  priceCents: z.number().int().nonnegative(),
  deliveryDays: z.number().int().positive().max(120).nullable().optional(),
  laborFeeCents: z.number().int().nonnegative().nullable().optional()
});
