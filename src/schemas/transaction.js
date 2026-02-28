import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const transactionSchema = z.object({
  transactionId: z.string().default(() => uuidv4()),
  orderId: z.string(),
  paymentMethod: z.enum(["cash", "card"]),
  status: z.enum(["success", "failed", "pending"]),
  amount: z.number().nonnegative(),
  createdAt: z.date().default(() => new Date()),
});
