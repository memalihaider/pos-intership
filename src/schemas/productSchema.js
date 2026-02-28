import {z} from "zod";
import {v4 as uuidv4} from "uuid"

export const productSchema = z.object({
  productId:z.string().default(()=>uuidv4()),  
  name: z.string(),
  sku: z.string(),
  barcode: z.string().optional(),
  category: z.string(),
  price: z.number().positive(),
  costPrice: z.number().positive(),
  stock: z.number().nonnegative(),
  lowStockAlert: z.number().nonnegative(),
  storeId: z.string(),
  createdAt: z.date().default(()=>new Date()),
});