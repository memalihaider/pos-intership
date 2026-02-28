import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const StoreSchema = z.object({
  storeId: z.string().default(() => uuidv4()),  
  name: z.string(),
  location: z.string(),
  contact: z.string(),
  manager: z.string(),
  employees:z.number().positive(),
  createdAt: z.date().default(() => new Date()),
});
