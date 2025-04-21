import { mailSchema } from "@/schemas/mail";
import { z } from "zod";

export type Mail = z.infer<typeof mailSchema>;

export interface SendMessageData {
  recipients: string[];
  subject: string;
  body: string;
  file: File | null;
}
