import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const inventoryHistorySchema = z.object({
  historyId: z.string().default(() => uuidv4()),
  productId: z.string(),
  storeId: z.string(),
  reason: z.enum(["sale", "manual update", "return"]),
  userId: z.string(), 
  createdAt: z.date().default(() => new Date()),
});
