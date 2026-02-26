import {z} from "zod";

export const userSchema = z.object({
    
    name:z.string(),
    email:z.string(),
    role:z.enum(["admin","manager","cashier","staff"]),
    storeId:z.string(),
    lastLogin:z.date()
})