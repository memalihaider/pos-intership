import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const userSchema = z.object({
  customerId: z.string().default(() => uuidv4()),  
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  loyaltyPoints: z.number().nonnegative(), // allows 0 points
  memberShipLevel: z.enum(["silver", "gold", "platinum"]), // fixed syntax
  createdAt: z.date().default(() => new Date()),
});
