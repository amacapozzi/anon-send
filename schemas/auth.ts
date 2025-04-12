import { z } from "zod";

export const signUpSchema = z
  .object({
    alias: z.string().min(3, { message: "Alias is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  alias: z
    .string({ required_error: "Alias is required" })
    .min(3, { message: "Alias must be at least 3 characters long" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(3, { message: "Password must be at least 3 characters long" }),
});
