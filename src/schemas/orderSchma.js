import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const orderSchema = z.object({
  orderId: z.string().default(() => uuidv4()),
  customerId: z.string(),
  storeId: z.string(),
  totalAmount: z.number().nonnegative(),
  paymentType: z.enum(["cash", "card",]),
  paymentStatus: z.enum(["paid", "pending", "refunded"]),
  discount: z.number().nonnegative().default(0),
  createdAt: z.date().default(() => new Date()),

});
