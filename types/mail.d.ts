import { mailSchema } from "@/schemas/mail";
import { z } from "zod";

export type Mail = z.infer<typeof mailSchema>;

export interface SendMessageData {
  title: string;
  message: string;
  file: File | null;
}
