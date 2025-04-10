import { z } from "zod";

export const signUpSchema = z.object({
  alias: z.string().min(3, { message: "Alias is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm password is required" }),
});
