import { signUpSchema } from "@/schemas/auth";
import { z } from "zod";

export type SignUpFormValues = z.infer<typeof signUpSchema>;

